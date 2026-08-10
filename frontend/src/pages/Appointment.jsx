// ============================================================
// IMPORTS
// ============================================================

import { assets } from '@/assets/assets'
import RelatedDoctors from '@/components/RelatedDoctors'
import { AppContext } from '@/context/AppContext'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'


// ============================================================
// APPOINTMENT COMPONENT
// ============================================================

export default function Appointment() {

    const { docId } = useParams()
    const navigate = useNavigate()

    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)

    const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT']

    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')


    const fetchDocInfo = async () => {
        const docInfo = doctors.find(doc => doc._id === docId)
        setDocInfo(docInfo)
    }


    const getAvailableSlots = async () => {
        setDocSlots([])
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            let endTime = new Date(today)
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(
                    currentDate.getHours() > 10
                        ? currentDate.getHours() + 1
                        : 10
                )
                currentDate.setMinutes(
                    currentDate.getMinutes() > 30 ? 30 : 0
                )
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })

                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: formattedTime
                })

                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }

            setDocSlots(prev => [...prev, timeSlots])
        }
    }


    // ========================================================
    // FUNCTION: bookAppointment (अब वास्तविक API call सहित)
    // ========================================================

    const bookAppointment = async () => {

        // Login नगरेको भए, login page मा पठाउने
        if (!token) {
            toast.warn('Login to book appointment')
            return navigate('/login')
        }

        if (!slotTime) {
            toast.warn('Please select a time slot first')
            return
        }

        const daySlots = docSlots[slotIndex]
        const selectedSlot = daySlots?.find(slot => slot.time === slotTime)

        if (!selectedSlot) {
            toast.error('Selected slot could not be found')
            return
        }

        try {

            // datetime बाट backend ले expect गर्ने "DD_MM_YYYY" format बनाउने
            const date = selectedSlot.datetime
            const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`

            const { data } = await axios.post(
                backendUrl + '/api/user/book-appointment',
                { docId, slotDate, slotTime },
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                getDoctorsData()       // doctors list refresh (availability update देखाउन)
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    useEffect(() => {
        getAvailableSlots()
    }, [docInfo])

    useEffect(() => {
        fetchDocInfo()
    }, [doctors, docId])

    useEffect(() => {
        setSlotTime('')
    }, [slotIndex, docSlots])


    return docInfo && (

        <div className='max-w-6xl mx-auto px-4'>

            <div className='flex flex-col sm:flex-row gap-4'>

                <div className='w-full sm:w-auto'>
                    <img
                        className='bg-primary w-full sm:max-w-72 rounded-lg'
                        src={docInfo.image}
                        alt={docInfo.name}
                    />
                </div>

                <div className='flex-1 min-w-0 border border-gray-400 rounded-lg p-8 py-7 bg-white mt-4 sm:mt-0'>

                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                        {docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="verified" />
                    </p>

                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>
                            {docInfo.experience}
                        </button>
                    </div>

                    <div className='mt-4'>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900'>
                            About
                            <img className='w-4' src={assets.info_icon} alt="info" />
                        </p>
                        <p className='text-sm text-gray-600 mt-1 break-words whitespace-pre-line'>
                            {docInfo.about}
                        </p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment fee:{' '}
                        <span className='text-gray-900'>
                            {currencySymbol}{' '}
                            {docInfo.fees}
                        </span>
                    </p>

                </div>

            </div>

            <div className='sm:ml-4 sm:pl-4 mt-4 font-medium text-gray-700'>

                <p>Booking Slots</p>

                <div className='relative mt-4'>

                    <div className='flex items-center gap-3 w-full overflow-x-auto pb-2 pr-4 scrollbar-hide snap-x snap-mandatory'>

                        {docSlots.length > 0 &&
                            docSlots.map((item, index) => (
                                item[0] && (
                                    <div
                                        onClick={() => setSlotIndex(index)}
                                        key={index}
                                        className={`flex flex-col items-center justify-center gap-1
                                            flex-shrink-0 w-16 py-4 rounded-full cursor-pointer transition-colors snap-start
                                            ${
                                                slotIndex === index
                                                    ? 'bg-primary text-white'
                                                    : 'border border-gray-300 text-gray-500'
                                            }`}
                                    >
                                        <p className='text-xs uppercase'>
                                            {daysOfWeek[item[0].datetime.getDay()]}
                                        </p>
                                        <p className='text-sm font-semibold'>
                                            {item[0].datetime.getDate()}
                                        </p>
                                    </div>
                                )
                            ))
                        }

                    </div>

                    <div className='pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent' />

                </div>

                <div className='relative mt-4'>

                    <div className='flex items-center gap-3 w-full overflow-x-auto pb-2 pr-4 scrollbar-hide snap-x snap-mandatory'>

                        {
                            docSlots.length > 0 &&
                            docSlots[slotIndex]?.map((item, index) => (
                                <p
                                    onClick={() => setSlotTime(item.time)}
                                    key={index}
                                    className={`flex-shrink-0 text-sm font-light px-5 py-2 rounded-full cursor-pointer transition-colors snap-start
                                        ${
                                            item.time === slotTime
                                                ? 'bg-primary text-white'
                                                : 'text-gray-500 border border-gray-300'
                                        }`}
                                >
                                    {item.time.toLowerCase()}
                                </p>
                            ))
                        }

                    </div>

                    <button
                        onClick={bookAppointment}
                        className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'
                    >
                        Book an appointment
                    </button>

                    <div className='pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent' />

                </div>

            </div>

            <RelatedDoctors
                docId={docId}
                speciality={docInfo.speciality}
            />

        </div>
    )
}