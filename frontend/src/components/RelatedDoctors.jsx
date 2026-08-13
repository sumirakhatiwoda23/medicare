// ============================================================
// IMPORTS
// ============================================================

// Import AppContext
// AppContext contains global data such as doctors and currency symbol
import { AppContext } from '@/context/AppContext'

// React hooks:
// useContext -> get data from Context
// useEffect   -> run code when something changes
// useState    -> create and manage state
import React, { use, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


// ============================================================
// RELATED DOCTORS COMPONENT
// ============================================================

// Props received from the parent (Appointment.jsx):
//
// speciality -> the specialty of the doctor currently being viewed
// docId      -> the ID of the doctor currently being viewed
//               (used so we don't show that same doctor in their
//               own "related doctors" list)

export default function RelatedDoctors({ speciality, docId }) {


    // --------------------------------------------------------
    // GET DATA FROM GLOBAL CONTEXT
    // --------------------------------------------------------

    // doctors:
    //   The full list of all doctors in the app.

    const { doctors } = useContext(AppContext)
const nav=useNavigate()

    // --------------------------------------------------------
    // STATE: RELATED DOCTORS LIST
    // --------------------------------------------------------

    // relDoc will hold only the doctors that share the same
    // speciality as the current doctor (and aren't the current
    // doctor themselves).
    //
    // Starts empty until the filtering effect below runs.

    const [relDoc, setRelDoc] = useState([])


    // ========================================================
    // EFFECT: FILTER DOCTORS BY SPECIALITY
    // ========================================================

    // Runs whenever doctors, speciality, or docId changes.
    //
    // It builds the "related doctors" list by keeping only
    // doctors who:
    //
    // 1. Have the same speciality as the current doctor
    // 2. Are NOT the current doctor themselves

    useEffect(() => {

        // Guard: don't run the filter until the doctors list
        // has actually loaded and we know what speciality
        // we're matching against.

        if (doctors.length > 0 && speciality) {

            const doctorsData = doctors.filter(
                (doc) =>
                    doc.speciality === speciality &&
                    doc._id !== docId
            )

            setRelDoc(doctorsData)
        }

    }, [doctors, speciality, docId])


    // ========================================================
    // RENDER / UI
    // ========================================================

    // Nothing is rendered yet — relDoc is computed above but
    // not used here. This is currently just an empty shell.

    return (
        <div>

<div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
<h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
<p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>

<div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>

    {
        relDoc.slice(0,5).map((item,index)=>(
       <div onClick={()=>{nav(`/appointment/${item._id}`);scrollTo(0,0)}}
        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
       key={index}>
        <img className='bg-blue-50'
        src={item.image} alt="" />
        <div className='p-4'>
          <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500': ' text-gray-500'}`}>
                <p className={`w-2 h-2 ${item.available ?' bg-green-500' : 'bg-gray-500'} rounded-full`}></p><p>{item.available?"Available":"Not Available"}</p>
            </div>
            <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
            <p className='text-gray-600 text-sm'>{item.speciality}</p>
        </div>
       </div>
       
    ))
}
</div>



    </div>
        </div>
    )
}