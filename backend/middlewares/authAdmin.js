import jwt from 'jsonwebtoken'


// admin authentication middleware

const authAdmin=async(req,res,next)=>{
try {
   
    const {atoken}=req.headers
    // This is the answer to your actual question: authAdmin gets the token from req.headers,
    //  because the frontend put it there in step 3. It has zero direct connection to loginAdmin —
    //  it doesn't import it, call it, or reference it in any way. The only link is: 
    // the frontend remembered the token loginAdmin generated earlier, and chose to attach it here.
    // . Later, admin tries to add a doctor — frontend attaches the saved token as a header

// javascript
// frontend, AddDoctor.jsx or similar
// const aToken = localStorage.getItem('aToken')

// const { data } = await axios.post(
//     backendUrl + '/api/admin/add-doctor',
//     formData,
//     { headers: { aToken } }
// )

// This is the critical moment — the frontend pulls the token back out of localStorage (where it saved it in step 2) and attaches it as a header on this new, completely different request.
    if(!atoken){
        return res.json({
            success:false,
            message:"Not authorized Login Again"
        })
    }
const token_decode=jwt.verify(atoken,process.env.JWT_SECRET)

if(token_decode!== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
    return res.json({
            success:false,
            message:"Not authorized Login Again"
        })
}
next()
} catch (error) {
    console.log(error)
        res.json({
            success:false,
            message:error.message
        })
}
}

export default authAdmin