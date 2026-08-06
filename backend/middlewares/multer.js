// Import the multer library — handles parsing multipart/form-data (needed for file uploads)
import multer from "multer";

// Configure WHERE and HOW uploaded files get saved on disk
const storage = multer.diskStorage({

    // destination: decides which FOLDER the file gets saved into
    destination: function(req, file, callback){
        // req    → the incoming request object (unused here, but available if needed)
        // file   → info about the uploaded file (name, mimetype, size, etc.)
        // callback → call this to tell multer the folder path
        //            first argument = error (null = no error)
        //            second argument = the folder name to save into
        callback(null, 'uploads/')
    },

    // filename: decides what NAME the saved file gets on disk
    filename: function(req, file, callback){
        // Date.now() → current timestamp in milliseconds, e.g. 1785996398263
        // file.originalname → the file's original name from the user's computer, e.g. "test.png"
        // Combining them avoids two different uploads overwriting each other
        // if they happen to have the same original filename
        callback(null, Date.now() + "-" + file.originalname)
        // Result example: "1785996398263-test.png"
    }
})

// Create the actual multer middleware, configured with the storage rules above
const upload = multer({ storage })

// Make "upload" available to import in other files (e.g. your route files)
export default upload