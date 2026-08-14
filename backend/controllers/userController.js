import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"


// helper: uploads a file buffer (from multer's memoryStorage) to Cloudinary
// via a stream, since there's no local file path to read from anymore
const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (result) resolve(result)
                else reject(error)
            }
        )
        stream.end(buffer)
    })
}


// API to register user
const registerUser = async (req,res) => {
    try {
        
        const { name, email, password } = req.body

        if( !name || !password || !email ) {
            return res.json({success:false,message:"Missing Details"})
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"enter a valid email"})
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({success:false,message:"enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()


        // _id
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

        res.json({success:true, token})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// API to login user
const loginUser = async (req,res) => {
    try {

        const { email, password } = req.body
        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({success:false, message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true, token})
        } else {
            res.json({success:false, message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// api to get user profile data
const getProfile = async (req,res) => {
    try {
        
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')
        res.json({success:true, userData})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// api to update user profile
const updateProfile = async (req,res) => {
    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({success:false, message:"Data Missing"})
        }

        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender
        })

        if (imageFile) {
            // upload image buffer to cloudinary directly (no local disk write)
            const imageUpload = await streamUpload(imageFile.buffer)
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, {image:imageURL})
        }

        res.json({success:true, message:"Profile Updated"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// API to book appointment
const bookAppointment = async(req,res)=>{
    try {
        
        const{userId,docId,slotDate,slotTime}=req.body

        console.log('--- BOOK APPOINTMENT DEBUG ---')
        console.log('userId:', userId)
        console.log('docId:', docId)
        console.log('slotDate:', slotDate)
        console.log('slotTime:', slotTime)

        const docData = await doctorModel.findById(docId).select('-password')

        console.log('docData found:', docData)
        console.log('docData.available:', docData?.available)

        if(!docData.available){
            console.log('BLOCKED: doctor.available is falsy')
            return res.json({success:false, message:'Doctor not available'})
        }

        let slots_booked=docData.slots_booked

        console.log('slots_booked before check:', slots_booked)

        // checking for slot availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                console.log('BLOCKED: slot already booked')
                return res.json({success:false, message:'Slot not available'})
            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        } else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')


        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in doctorData

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
         
        console.log('SUCCESS: appointment booked')
        res.json({
            success:true,
            message:'Appointment Booked',
            appointmentId: newAppointment._id
        })



    } catch (error) {
        console.log('CATCH ERROR:', error)
        res.json({success:false, message:error.message})
    }
}

// API to get appointment for frontend my-appointments page

const listAppointment = async (req,res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success:true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success:false, message:error.message })
    }
}
// API TO CANCEL THE APOINTMENT
// API to cancel appointment
const cancelAppointment = async (req,res) => {
    try {

        const { userId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment belongs to the logged-in user
        if (appointmentData.userId !== userId) {
            return res.json({ success:false, message:"Unauthorized action" })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled:true })

        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success:true, message:"Appointment Cancelled" })

    } catch (error) {
        console.log(error)
        res.json({ success:false, message:error.message })
    }
}







export { registerUser, loginUser, getProfile,updateProfile ,bookAppointment , listAppointment , cancelAppointment}