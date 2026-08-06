import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true }, // will store Cloudinary/S3 URL, not a local import like frontend
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true }, // { line1, line2 }
    date: { type: Number, required: true }, // Date.now() when created
    slots_booked: { type: Object, default: {} } // { "2026-08-05": ["10:00 AM", "10:30 AM"] }
}, { minimize: false })

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema)

export default doctorModel