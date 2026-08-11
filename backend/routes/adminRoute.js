import express from 'express'
import { addDoctor, allDoctors, appointmentCancel, appointmentsAdmin, loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailablity } from '../controllers/doctorController.js'




const adminRouter=express.Router()

// adding new doctor post
adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
// Frontend sends POST /api/admin/add-doctor with FormData
//          ↓
// adminRouter matches the path '/add-doctor'
//          ↓
// upload.single('image') runs
//     → parses text fields → req.body = { name, email, speciality, ... }
//     → saves image file → req.file = { path, filename, ... }
//     → calls next()
//          ↓
// addDoctor(req, res) runs
//     → destructures req.body
//     → uses req.file.path to upload to Cloudinary
//     → saves everything to MongoDB via doctorModel
//     → sends response back

adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin ,allDoctors)
adminRouter.post('/change-availability',authAdmin ,changeAvailablity)
adminRouter.get('/appointments',authAdmin ,appointmentsAdmin)
// routes/adminRoute.js
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)


export default adminRouter