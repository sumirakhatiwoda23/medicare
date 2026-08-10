import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'

// app config

const app=express()
const port=process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares

app.use(express.json())
app.use(cors())

// api endpoints

app.use('/api/admin',adminRouter)
// localhost:4000/api/admin
// Express checks: does this URL start with /api/admin? → Yes. So it hands off the rest of the URL (/add-doctor) to adminRouter to handle internally.
app.use('/api/doctor',doctorRouter)

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'API working'
    })
})

app.listen(port,()=>{
    console.log('Server Started',port)
})