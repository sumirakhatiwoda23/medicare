// Import the multer library — handles parsing multipart/form-data (needed for file uploads)
import multer from "multer";

// Store the uploaded file in memory as a buffer instead of writing it to disk.
// This avoids relying on a local 'uploads/' folder existing on the server —
// which is what was breaking image uploads on Render (the folder was never
// created there, so multer's diskStorage failed silently before the request
// even reached the controller).
//
// With memoryStorage, the file is kept in RAM as req.file.buffer, and we
// upload that buffer directly to Cloudinary instead of reading it off disk.
const storage = multer.memoryStorage();

// Create the actual multer middleware, configured with memory storage
const upload = multer({ storage });

// Make "upload" available to import in other files (e.g. your route files)
export default upload;