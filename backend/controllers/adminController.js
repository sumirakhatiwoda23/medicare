
import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
// api for adding doctor


const addDoctor=async(req,res)=>{
    try {
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body
//         This only knows how to open JSON boxes. It has zero idea how to open a FormData box. If a FormData box arrives, express.json() just shrugs — req.body comes out empty.

// So we need a helper whose only job is: "open the FormData box, take out the papers (text) and put them in req.body, take out the photo (file) and put it in req.file."

// That helper is multer. It's middleware, meaning: it runs before your controller function, and prepares the request so your controller can actually use it.
    const imageFile=req.file

// checking for all data to add doctor

if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

// validating emailFormat
if(!validator.isEmail(email)){
    return res.json({
        success:false,
        message:"Please enter a valid email"
    })
}

// validating a strong password
if(password.length<8){
    return res.json({
        success:false,
        message:"Please enter a strong passowrd"
    })
}

// hashing the doctor password
const salt=await bcrypt.genSalt(10)
const hashedPassword=await bcrypt.hash(password,salt)

// upload image to cloudinary
const imageUpload= await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
const imageUrl=imageUpload.secure_url


const doctorData={
    name,
    email,
    image:imageUrl,
    password:hashedPassword,
    speciality,
    degree,
    experience,
    about,
    fees,
    address:JSON.parse(address),
    date:Date.now()
    // in form data we have to ocnvert it in string so used json parse method
}

const newDoctor= new  doctorModel(doctorData)
await newDoctor.save()

res.json({
    success:true,
    message:"Doctor Added"
})
 } catch (error) {
    console.log(error)
        res.json({
            success:false,
            message:error.message
        })
        
    }
}
// api for admin login

const loginAdmin=async(req,res)=>{
    try {
        
    
        const {email,password}=req.body
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){

            const token= jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})

// 1. Admin logs in with email + password
//         ↓
// 2. Server verifies credentials are correct
//         ↓
// 3. Server creates a JWT ("here's proof you're logged in")
//         ↓
// 4. Server sends that token back to the frontend
//         ↓
// 5. Frontend stores the token (localStorage, etc.)
//         ↓
// 6. On every future request (like "add doctor"), frontend attaches 
//    the token in the request headers
//         ↓
// 7. Server verifies the token is valid → knows this really is 
//    the authenticated admin → allows the action
        }
        else{
            res.json({
                success:false,
                message:"Invalid credentials"
            })
        }





    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}

// API to get all doctors list for admin panel

const allDoctors= async(req,res)=>{
    try {

   const doctors = await doctorModel.find({}).select('-password')
   res.json({
   success:true,
   doctors
   })


        
    } catch (error) {
         console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}


// API to get all appointment list
// API to get all appointment list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// API  for appointment cancellation



// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Appointment Cancelled" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel

const adminDashboard = async(req,res)=>{
try {
    
} catch (error) {
    
}



}



export {addDoctor,loginAdmin, allDoctors , appointmentsAdmin , appointmentCancel}