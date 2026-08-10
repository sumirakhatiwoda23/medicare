// backend/seed/seedDoctors.js
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"
import doctorModel from "../models/doctorModel.js"

dotenv.config()

// ---- Cloudinary config (same as your main app) ----
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

// ---- Raw doctor data ----
const rawDoctors = [
    { name: 'Dr. Richard James', speciality: 'General physician', degree: 'MBBS', experience: '4 Years', fees: 50, imagePath: './images/doc1.png', address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Emily Larson', speciality: 'Gynecologist', degree: 'MBBS', experience: '3 Years', fees: 60, imagePath: './images/doc2.png', address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Sarah Patel', speciality: 'Dermatologist', degree: 'MBBS', experience: '1 Years', fees: 30, imagePath: './images/doc3.png', address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Christopher Lee', speciality: 'Pediatricians', degree: 'MBBS', experience: '2 Years', fees: 40, imagePath: './images/doc4.png', address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Jennifer Garcia', speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', fees: 50, imagePath: './images/doc5.png', address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Andrew Williams', speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', fees: 50, imagePath: './images/doc6.png', address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Christopher Davis', speciality: 'General physician', degree: 'MBBS', experience: '4 Years', fees: 50, imagePath: './images/doc7.png', address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Timothy White', speciality: 'Gynecologist', degree: 'MBBS', experience: '3 Years', fees: 60, imagePath: './images/doc8.png', address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Ava Mitchell', speciality: 'Dermatologist', degree: 'MBBS', experience: '1 Years', fees: 30, imagePath: './images/doc9.png', address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Jeffrey King', speciality: 'Pediatricians', degree: 'MBBS', experience: '2 Years', fees: 40, imagePath: './images/doc10.png', address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Zoe Kelly', speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', fees: 50, imagePath: './images/doc11.png', address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Patrick Harris', speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', fees: 50, imagePath: './images/doc12.png', address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Chloe Evans', speciality: 'General physician', degree: 'MBBS', experience: '4 Years', fees: 50, imagePath: './images/doc13.png', address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Ryan Martinez', speciality: 'Gynecologist', degree: 'MBBS', experience: '3 Years', fees: 60, imagePath: './images/doc14.png', address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Amelia Hill', speciality: 'Dermatologist', degree: 'MBBS', experience: '1 Years', fees: 30, imagePath: './images/doc15.png', address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. James Wilson', speciality: 'Gastroenterologist', degree: 'MBBS', experience: '5 Years', fees: 60, imagePath: './images/doc1.png', address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Sophia Turner', speciality: 'Gastroenterologist', degree: 'MBBS', experience: '3 Years', fees: 55, imagePath: './images/doc2.png', address: { line1: '22nd Cross, Richmond', line2: 'Circle, Ring Road, London' } },
    { name: 'Dr. Daniel Brown', speciality: 'Gastroenterologist', degree: 'MBBS', experience: '7 Years', fees: 70, imagePath: './images/doc3.png', address: { line1: '45th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
]

const aboutText = 'Dr has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.'

const generateEmail = (name) => {
    const cleaned = name
        .toLowerCase()
        .replace(/^dr\.?\s*/i, '')
        .replace(/[^a-z\s]/g, '')
        .trim()
        .split(/\s+/)
        .join('.')
    return `${cleaned}@medicare.com`
}

const TEMP_PASSWORD = 'Doctor@123'

const doctorsToSeed = rawDoctors.map(doc => ({
    ...doc,
    email: generateEmail(doc.name),
    password: TEMP_PASSWORD,
    about: aboutText
}))

const seedDatabase = async () => {
    try {
        // ✅ FIX: /prescripto थपियो, connectDB.js सँग consistent बनाइयो
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)
        console.log('MongoDB connected')
        console.log('Connected to database:', mongoose.connection.name)

        if (mongoose.connection.name !== 'prescripto') {
            console.log('⚠️  WARNING: Not connected to "prescripto" database! Aborting.')
            process.exit(1)
        }

        for (const doc of doctorsToSeed) {
            const exists = await doctorModel.findOne({ email: doc.email })
            if (exists) {
                console.log(`Skipped (already exists): ${doc.name} — ${doc.email}`)
                continue
            }

            const hashedPassword = await bcrypt.hash(doc.password, 10)
            const imageUpload = await cloudinary.uploader.upload(doc.imagePath, { resource_type: "image" })

            const newDoctor = new doctorModel({
                name: doc.name,
                email: doc.email,
                password: hashedPassword,
                image: imageUpload.secure_url,
                speciality: doc.speciality,
                degree: doc.degree,
                experience: doc.experience,
                about: doc.about,
                available: true,
                fees: doc.fees,
                address: doc.address,
                date: Date.now(),
                slots_booked: {}
            })

            await newDoctor.save()
            console.log(`Added: ${doc.name} — ${doc.email} / ${doc.password}`)
        }

        console.log('\nSeeding complete!')
        process.exit(0)

    } catch (error) {
        console.error('Seeding failed:', error)
        process.exit(1)
    }
}

seedDatabase()