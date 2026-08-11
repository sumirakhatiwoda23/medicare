import { assets } from '@/assets/assets'
import RelatedDoctors from '@/components/RelatedDoctors'
import { AppContext } from '@/context/AppContext'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { redirectToEsewa } from '@/utils/esewaCheckout'

export default function Appointment() {

    const { docId } = useParams()

    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)

    const daysOfWeek = [
        'SUN',
        'MON',
        'TUE',
        'WED',
        'THU',
        'FRI',
        'SAT'
    ]

    const nav = useNavigate()
    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')

    // confirmation modal state
    const [showConfirm, setShowConfirm] = useState(false)
    // tracks whether booking/payment request is in progress, to disable buttons and avoid double clicks
    const [processing, setProcessing] = useState(false)

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
                    currentDate.getMinutes() > 30
                        ? 30
                        : 0
                )

            } else {

                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []

            while (currentDate < endTime) {

                let formattedTime = currentDate.toLocaleTimeString(
                    [],
                    {
                        hour: '2-digit',
                        minute: '2-digit'
                    }
                )

                let day=currentDate.getDate()
                let month=currentDate.getMonth()+1
                let year=currentDate.getFullYear()

                const slotDate=day+"_"+month+"_"+year
                const slotTime = formattedTime

                const isSlotAvailable= docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true
                  
 if(isSlotAvailable){

     timeSlots.push({
         datetime: new Date(currentDate),
         time: formattedTime
     })
 }



                currentDate.setMinutes(
                    currentDate.getMinutes() + 30
                )
            }

            setDocSlots(prev => [
                ...prev,
                timeSlots
            ])
        }
    }

    // books the appointment via cash/pay-later flow (original behaviour, unchanged)
    const confirmBookAppointment = async () => {

        setProcessing(true)

        try {
            const date = docSlots[slotIndex][0].datetime
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()

            const slotDate = day + "_" + month + "_" + year

            const { data } = await axios.post(
                backendUrl + '/api/user/book-appointment',
                { docId, slotDate, slotTime },
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                getDoctorsData()
                nav('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setProcessing(false)
            setShowConfirm(false)
        }
    }

    // books the appointment, then immediately redirects to eSewa sandbox for payment
    // NOTE: this assumes your /api/user/book-appointment response includes the new appointment's _id
    // as data.appointmentId — adjust the field name below if your backend returns it differently
    const bookAndPayWithEsewa = async () => {

        setProcessing(true)

        try {
            const date = docSlots[slotIndex][0].datetime
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()

            const slotDate = day + "_" + month + "_" + year

            // step 1: create the appointment first
            const bookRes = await axios.post(
                backendUrl + '/api/user/book-appointment',
                { docId, slotDate, slotTime },
                { headers: { token } }
            )

            if (!bookRes.data.success) {
                toast.error(bookRes.data.message)
                setProcessing(false)
                return
            }

            const appointmentId = bookRes.data.appointmentId

            if (!appointmentId) {
                toast.error('Could not start payment — appointment ID missing')
                setProcessing(false)
                return
            }

            // step 2: ask backend to generate signed eSewa payment data
            const esewaRes = await axios.post(
                backendUrl + '/api/user/esewa-initiate',
                { appointmentId, amount: docInfo.fees },
                { headers: { token } }
            )

            if (esewaRes.data.success) {
                // step 3: redirect browser to eSewa's sandbox checkout page
                redirectToEsewa(esewaRes.data.paymentData)
            } else {
                toast.error(esewaRes.data.message)
                setProcessing(false)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
            setProcessing(false)
        }
    }

    // runs when "Book an appointment" button is clicked — validates, then opens modal instead of booking directly
    const bookAppointment = () => {

        if (!token) {
            toast.warn('Login to book Appointment')
            return nav('/login')
        }

        if (!slotTime) {
            toast.warn('Please select a time slot')
            return
        }

        setShowConfirm(true)
    }

    // human-readable date for the modal, e.g. "SUN, 14 Sep"
    const getSelectedDateLabel = () => {
        const dateObj = docSlots[slotIndex]?.[0]?.datetime
        if (!dateObj) return ''
        const day = daysOfWeek[dateObj.getDay()]
        const date = dateObj.getDate()
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        const month = monthNames[dateObj.getMonth()]
        return `${day}, ${date} ${month}`
    }

    useEffect(() => {
        getAvailableSlots()
    }, [docInfo])

    useEffect(() => {
        fetchDocInfo()
    }, [doctors, docId])

    useEffect(() => {
        console.log(docSlots)
    }, [docSlots])

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
                        <img
                            className='w-5'
                            src={assets.verified_icon}
                            alt="verified"
                        />
                    </p>

                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>
                            {docInfo.degree} - {docInfo.speciality}
                        </p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>
                            {docInfo.experience}
                        </button>
                    </div>

                    <div className='mt-4'>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900'>
                            About
                            <img
                                className='w-4'
                                src={assets.info_icon}
                                alt="info"
                            />
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
                                        {
                                            item[0] &&
                                            daysOfWeek[
                                                item[0].datetime.getDay()
                                            ]
                                        }
                                    </p>

                                    <p className='text-sm font-semibold'>
                                        {
                                            item[0] &&
                                            item[0].datetime.getDate()
                                        }
                                    </p>

                                </div>

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
                        className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full cursor-pointer my-6'
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

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">

                        <h3 className="text-base font-semibold text-gray-900">
                            Confirm Appointment
                        </h3>

                        <p className="mt-2 text-sm text-gray-600">
                            You are about to book an appointment with{' '}
                            <span className="font-medium text-gray-900">{docInfo.name}</span> on{' '}
                            <span className="font-medium text-gray-900">{getSelectedDateLabel()}</span> at{' '}
                            <span className="font-medium text-gray-900">{slotTime}</span>.
                        </p>

                        <p className="mt-2 text-sm text-gray-600">
                            Consultation fee:{' '}
                            <span className="font-medium text-gray-900">
                                {currencySymbol} {docInfo.fees}
                            </span>
                        </p>

                        <p className="mt-3 text-sm text-gray-600">
                            Choose how you'd like to proceed.
                        </p>

                        <div className="mt-6 flex flex-col gap-2">

                            <button
                                onClick={bookAndPayWithEsewa}
                                disabled={processing}
                                className="text-sm px-4 py-2 rounded bg-green-600 text-white hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : 'Book & Pay with eSewa'}
                            </button>

                            <button
                                onClick={confirmBookAppointment}
                                disabled={processing}
                                className="text-sm px-4 py-2 rounded bg-primary text-white hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : 'Book Now, Pay Later'}
                            </button>

                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={processing}
                                className="text-sm px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
                            >
                                Go Back
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}