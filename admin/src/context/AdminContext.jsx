import axios from "axios"
import { createContext, useState } from "react"
import { toast } from "react-toastify"
// createContext: React's tool for building a "global store" that any component can read from,
// without passing props down manually through every level (avoids "prop drilling").
// useState: lets us hold a piece of data that can change and trigger re-renders.


export const AdminContext = createContext()
// Creates the actual Context object. Think of it as an empty "container" for now —
// it doesn't hold any data yet, it's just the channel that data will flow through.
// Exported so any component in the app can import AdminContext and "tap into" it later.


const AdminContextProvider = (props) => {
    // This is a wrapper component. Its whole job is to hold the real admin-related data
    // and make it available to every component nested inside it via {props.children}.

    const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    // aToken: the admin's authentication token (like a login session key).
    // Starts as an empty string '' — meaning "not logged in yet."
    // Once the admin logs in successfully, setAToken('someRealTokenString') updates this,
    // and every component using this context instantly sees the new value.
    
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    // Reads an environment variable — the backend API's base URL (e.g. "https://api.example.com").
    // import.meta.env is how Vite (your build tool) exposes .env file variables to your code.
    // Prefixing it with VITE_ is required — Vite only exposes env vars that start with "VITE_"
    // to the frontend, for security (so you don't accidentally leak secret keys).
    
    const[appointments, setAppointments]= useState([])
const[doctors,setDoctors]=useState([])
const[dashData,setDashData]=useState(false)
     const getAllDoctors = async()=>{
        try {

       const {data}=await axios.post(backendUrl+'/api/admin/all-doctors',{},{headers:{aToken}})
   if(data.success){
    setDoctors(data.doctors)
    console.log(data.doctors)
   }
   else{
    toast.error(data.message)
   }
            
        } catch (error) {
            toast.error(error.message)
        }
     }


     const changeAvailability = async(docId)=>{
        try {
            
const { data}=await axios.post(backendUrl+ '/api/admin/change-availability',{docId},{headers:{aToken}})
 if(data.success){
    toast.success(data.message)
    getAllDoctors()
 }
else{
    toast.error(data.message)
}
            
        } catch (error) {
             toast.error(error.message)
        }
     }


const getAllAppointments = async () => {
    try {

        const { data } = await axios.get(
            backendUrl + '/api/admin/appointments',
            { headers: { aToken } }
        )

        if (data.success) {
            setAppointments(data.appointments)
            console.log(data.appointments)
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}

const cancelAppointment = async (appointmentId) => {
    try {

        const { data } = await axios.post(
            backendUrl + '/api/admin/cancel-appointment',
            { appointmentId },
            { headers: { aToken } }
        )

        if (data.success) {
            toast.success(data.message)
            getAllAppointments()
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}

 const getDashData = async () => {

    try {

        const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

        if (data.success) {
            setDashData(data.dashData)
            console.log(data.dashData)
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        toast.error(error.message)
    }
}



    const value = {
        aToken, setAToken,
        backendUrl,doctors,getAllDoctors,changeAvailability,
        appointments,setAppointments,getAllAppointments,cancelAppointment,
        dashData,getDashData
    }
    // Bundles everything we want to share into one object.
    // Any component using this context will get access to:
    //   - aToken (read the current token)
    //   - setAToken (update the token, e.g. on login/logout)
    //   - backendUrl (know where to send API requests)

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
        // AdminContext.Provider is what actually "broadcasts" the value object
        // to every component nested inside it.
        // {props.children} represents whatever components get wrapped by
        // <AdminContextProvider> in your app tree — e.g. your whole <App /> or admin routes —
        // so all of them (and their children, and their children's children, etc.)
        // can access aToken, setAToken, and backendUrl without needing props passed manually.
    )
}

export default AdminContextProvider
// Exported as default so you can import it wherever you set up your app,
// typically wrapping it around your admin routes/pages like:
//   <AdminContextProvider>
//       <AdminApp />
//   </AdminContextProvider>