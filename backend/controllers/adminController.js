


// api for adding doctor


const addDoctor=async(req,res)=>{
    try {
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body
//         This only knows how to open JSON boxes. It has zero idea how to open a FormData box. If a FormData box arrives, express.json() just shrugs — req.body comes out empty.

// So we need a helper whose only job is: "open the FormData box, take out the papers (text) and put them in req.body, take out the photo (file) and put it in req.file."

// That helper is multer. It's middleware, meaning: it runs before your controller function, and prepares the request so your controller can actually use it.
    } catch (error) {
        
    }
}