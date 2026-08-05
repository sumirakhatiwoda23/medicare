// ============================================================
// IMPORTS
// ============================================================

// Import images/icons stored inside the assets file
import { assets } from '@/assets/assets'

// Import RelatedDoctors component
// This component will show doctors related to the current doctor
import RelatedDoctors from '@/components/RelatedDoctors'

// Import AppContext
// AppContext contains global data such as doctors and currency symbol
import { AppContext } from '@/context/AppContext'

// React hooks:
// useContext -> get data from Context
// useEffect   -> run code when something changes
// useState    -> create and manage state
import React, { useContext, useEffect, useState } from 'react'

// useParams gets parameters from the URL
// Example:
// /appointment/123
// Here docId will be "123"
import { useParams } from 'react-router-dom'


// ============================================================
// APPOINTMENT COMPONENT
// ============================================================

export default function Appointment() {


    // --------------------------------------------------------
    // GET DOCTOR ID FROM URL
    // --------------------------------------------------------

    // useParams() gives us the dynamic values from the URL.
    //
    // If our route is:
    // /appointment/:docId
    //
    // And the URL is:
    // /appointment/123
    //
    // Then:
    // docId = "123"

    const { docId } = useParams()


    // --------------------------------------------------------
    // GET DATA FROM GLOBAL CONTEXT
    // --------------------------------------------------------

    // AppContext contains global application data.
    //
    // doctors:
    //   Contains all doctors
    //
    // currencySymbol:
    //   Currency used for displaying appointment fees
    //   Example: "$", "₹", "Rs."

    const { doctors, currencySymbol } = useContext(AppContext)


    // --------------------------------------------------------
    // DAYS OF THE WEEK
    // --------------------------------------------------------

    // JavaScript Date.getDay() returns:
    //
    // 0 -> Sunday
    // 1 -> Monday
    // 2 -> Tuesday
    // 3 -> Wednesday
    // 4 -> Thursday
    // 5 -> Friday
    // 6 -> Saturday
    //
    // This array converts those numbers into readable names.

    const daysOfWeek = [
        'SUN',
        'MON',
        'TUE',
        'WED',
        'THU',
        'FRI',
        'SAT'
    ]


    // --------------------------------------------------------
    // STATE 1: DOCTOR INFORMATION
    // --------------------------------------------------------

    // docInfo will store information about the specific doctor
    // whose appointment page we are currently viewing.
    //
    // Initially it is null because we haven't found the doctor yet.
    //
    // setDocInfo() is used to update docInfo.

    const [docInfo, setDocInfo] = useState(null)


    // --------------------------------------------------------
    // STATE 2: AVAILABLE APPOINTMENT SLOTS
    // --------------------------------------------------------

    // docSlots stores appointment slots for 7 days.
    //
    // It is a 2D array.
    //
    // Example:
    //
    // docSlots = [
    //     [today's slots],
    //     [tomorrow's slots],
    //     [day 3 slots],
    //     [day 4 slots],
    //     [day 5 slots],
    //     [day 6 slots],
    //     [day 7 slots]
    // ]
    //
    // Initially there are no slots.

    const [docSlots, setDocSlots] = useState([])


    // --------------------------------------------------------
    // STATE 3: SELECTED DAY
    // --------------------------------------------------------

    // slotIndex tells us which day the user has selected.
    //
    // 0 = first day
    // 1 = second day
    // 2 = third day
    // ...
    //
    // Initially the first day is selected.

    const [slotIndex, setSlotIndex] = useState(0)


    // --------------------------------------------------------
    // STATE 4: SELECTED TIME
    // --------------------------------------------------------

    // slotTime stores the appointment time selected by the user.
    //
    // Initially nothing is selected, so it is an empty string.
    //
    // Example:
    // "04:30 PM"

    const [slotTime, setSlotTime] = useState('')


    // ========================================================
    // FUNCTION: fetchDocInfo
    // ========================================================

    // This function finds the doctor from the doctors array
    // using the docId that came from the URL.

    const fetchDocInfo = async () => {

        // .find() searches through the doctors array.
        //
        // For every doctor:
        // doc._id === docId
        //
        // When the IDs match, that doctor is returned.

        const docInfo = doctors.find(doc => doc._id === docId)


        // Save the found doctor inside the docInfo state.

        setDocInfo(docInfo)
    }


    // ========================================================
    // FUNCTION: getAvailableSlots
    // ========================================================

    // This function generates appointment times
    // for the next 7 days.

    const getAvailableSlots = async () => {


        // Clear the previous slots first.
        //
        // This is important because if the function runs again,
        // we don't want to keep adding duplicate slots.

        setDocSlots([])


        // Create a Date object containing the current date and time.

        let today = new Date()


        // ----------------------------------------------------
        // LOOP THROUGH 7 DAYS
        // ----------------------------------------------------

        // i = 0 -> today
        // i = 1 -> tomorrow
        // i = 2 -> day after tomorrow
        // ...
        // i = 6 -> sixth day from today

        for (let i = 0; i < 7; i++) {


            // ------------------------------------------------
            // CREATE CURRENT DATE
            // ------------------------------------------------

            // Create a copy of today's date.

            let currentDate = new Date(today)


            // Change the date according to the loop.
            //
            // If today is August 5:
            //
            // i = 0 -> August 5
            // i = 1 -> August 6
            // i = 2 -> August 7
            // etc.

            currentDate.setDate(today.getDate() + i)


            // ------------------------------------------------
            // CREATE END TIME
            // ------------------------------------------------

            // Create another Date object for the same day.

            let endTime = new Date(today)


            // Set it to the current day being processed.

            endTime.setDate(today.getDate() + i)


            // Appointment slots will stop at 9:00 PM.
            //
            // setHours(hour, minute, second, millisecond)
            //
            // 21 = 9 PM

            endTime.setHours(21, 0, 0, 0)


            // ------------------------------------------------
            // IF TODAY
            // ------------------------------------------------

            // If currentDate is today,
            // we must make sure we don't show appointment
            // times that have already passed.

            if (today.getDate() === currentDate.getDate()) {


                // If current hour is greater than 10,
                // start one hour after the current hour.
                //
                // Otherwise start at 10 AM.
                //
                // Example:
                //
                // Current time = 2 PM
                // Start time = 3 PM
                //
                // Current time = 8 AM
                // Start time = 10 AM

                currentDate.setHours(
                    currentDate.getHours() > 10
                        ? currentDate.getHours() + 1
                        : 10
                )


                // ------------------------------------------------
                // SET MINUTES
                // ------------------------------------------------

                // Appointment times should be on the half-hour:
                //
                // :00
                // :30
                //
                // If current minutes are greater than 30,
                // use :30.
                //
                // Otherwise use :00.

                currentDate.setMinutes(
                    currentDate.getMinutes() > 30
                        ? 30
                        : 0
                )

            } else {


                // ------------------------------------------------
                // FUTURE DAYS
                // ------------------------------------------------

                // For future days, appointments always start
                // from 10:00 AM.

                currentDate.setHours(10)

                currentDate.setMinutes(0)
            }


            // ------------------------------------------------
            // CREATE ARRAY FOR ONE DAY
            // ------------------------------------------------

            // This array will contain all appointment times
            // for the current day.

            let timeSlots = []


            // ------------------------------------------------
            // GENERATE 30-MINUTE SLOTS
            // ------------------------------------------------

            // Keep generating slots while the current time
            // is before 9 PM.

            while (currentDate < endTime) {


                // ------------------------------------------------
                // FORMAT TIME
                // ------------------------------------------------

                // Convert the Date object into readable time.
                //
                // Example:
                // 16:30
                //
                // becomes:
                // 04:30 PM

                let formattedTime = currentDate.toLocaleTimeString(
                    [],
                    {
                        hour: '2-digit',
                        minute: '2-digit'
                    }
                )


                // ------------------------------------------------
                // STORE THE SLOT
                // ------------------------------------------------

                timeSlots.push({

                    // Store the complete date and time.
                    //
                    // new Date(currentDate) creates a COPY.
                    // This is important because currentDate
                    // will be changed later.

                    datetime: new Date(currentDate),

                    // Store the formatted time for displaying
                    // to the user.

                    time: formattedTime
                })


                // ------------------------------------------------
                // MOVE 30 MINUTES FORWARD
                // ------------------------------------------------

                // Example:
                //
                // 10:00 -> 10:30
                // 10:30 -> 11:00
                // 11:00 -> 11:30
                //
                // This continues until 9 PM.

                currentDate.setMinutes(
                    currentDate.getMinutes() + 30
                )
            }


            // ------------------------------------------------
            // ADD THIS DAY'S SLOTS TO docSlots
            // ------------------------------------------------

            // prev = previous value of docSlots
            //
            // ...prev = copy all existing days
            //
            // timeSlots = newly generated slots for this day
            //
            // So a new day is appended to the array.

            setDocSlots(prev => [
                ...prev,
                timeSlots
            ])
        }
    }


    // ========================================================
    // FUNCTION: bookAppointment
    // ========================================================

    // This function runs when the user clicks
    // "Book an appointment".
    //
    // It figures out exactly which date+time the user picked,
    // and (for now) logs it — this is the spot where a real
    // API call to the backend will go once that endpoint exists.

    const bookAppointment = () => {

        // --------------------------------------------------
        // GUARD: NO TIME SELECTED
        // --------------------------------------------------

        // If the user hasn't picked a time slot yet,
        // there's nothing to book — stop here.
        //
        // (You could also show a toast/alert here instead
        // of silently returning.)

        if (!slotTime) {
            console.log('Please select a time slot first')
            return
        }


        // --------------------------------------------------
        // FIND THE FULL SLOT OBJECT
        // --------------------------------------------------

        // slotTime only stores the display string, e.g. "04:30 PM".
        //
        // To actually book something we need the real Date object
        // (datetime) that matches that display string, from the
        // currently selected day's slots.

        const daySlots = docSlots[slotIndex]

        const selectedSlot = daySlots?.find(
            slot => slot.time === slotTime
        )


        // --------------------------------------------------
        // GUARD: SLOT NOT FOUND
        // --------------------------------------------------

        // This shouldn't normally happen since slotTime is only
        // ever set by clicking one of the rendered slots, but it's
        // a cheap safety check in case docSlots changes underneath us.

        if (!selectedSlot) {
            console.log('Selected slot could not be found')
            return
        }


        // --------------------------------------------------
        // BUILD THE BOOKING PAYLOAD
        // --------------------------------------------------

        // This is the shape of data a real backend endpoint
        // would likely expect:
        //
        // docId    -> which doctor
        // date     -> full Date object for the appointment
        // time     -> human-readable time, for convenience

        const bookingPayload = {
            docId,
            date: selectedSlot.datetime,
            time: slotTime
        }


        // --------------------------------------------------
        // SEND / LOG THE BOOKING
        // --------------------------------------------------

        // TODO: replace this console.log with an actual API call,
        // e.g.:
        //
        // const { data } = await axios.post(
        //     backendUrl + '/api/user/book-appointment',
        //     bookingPayload,
        //     { headers: { token } }
        // )

        console.log('Booking appointment:', bookingPayload)
    }


    // ========================================================
    // useEffect 1: GENERATE AVAILABLE SLOTS
    // ========================================================

    // This effect runs whenever docInfo changes.
    //
    // Once the doctor information is loaded,
    // generate the available appointment slots.

    useEffect(() => {

        getAvailableSlots()

    }, [docInfo])


    // ========================================================
    // useEffect 2: FIND DOCTOR
    // ========================================================

    // This effect runs when:
    //
    // 1. doctors changes
    // 2. docId changes
    //
    // Then it searches for the correct doctor.

    useEffect(() => {

        fetchDocInfo()

    }, [doctors, docId])


    // ========================================================
    // useEffect 3: DEBUGGING
    // ========================================================

    // Every time docSlots changes,
    // print the updated slots in the browser console.
    //
    // This is mainly useful while developing/debugging.

    useEffect(() => {

        console.log(docSlots)

    }, [docSlots])


    // ========================================================
    // useEffect 4: RESET SELECTED TIME
    // ========================================================

    // If the user changes the selected day,
    // clear the previously selected time.
    //
    // Example:
    //
    // Monday -> 04:30 PM selected
    //
    // User clicks Tuesday
    //
    // We don't want 04:30 PM from Monday
    // to remain selected on Tuesday.
    //
    // Therefore:
    // setSlotTime('')

    useEffect(() => {

        setSlotTime('')

    }, [slotIndex, docSlots])


    // ========================================================
    // RETURN / UI
    // ========================================================

    // Only render the page when docInfo exists.
    //
    // If docInfo is null:
    // nothing is rendered.
    //
    // This prevents errors such as:
    // docInfo.name
    // when docInfo hasn't loaded yet.

    return docInfo && (

        <div className='max-w-6xl mx-auto px-4'>


            {/* ==================================================
                DOCTOR DETAILS
            ================================================== */}

            <div className='flex flex-col sm:flex-row gap-4'>


                {/* ---------------- DOCTOR IMAGE ---------------- */}

                <div className='w-full sm:w-auto'>

                    <img
                        className='bg-primary w-full sm:max-w-72 rounded-lg'

                        // Display doctor's image
                        src={docInfo.image}

                        // Alternative text for the image
                        alt={docInfo.name}
                    />

                </div>


                {/* ---------------- DOCTOR INFORMATION ---------------- */}

                <div className='flex-1 min-w-0 border border-gray-400 rounded-lg p-8 py-7 bg-white mt-4 sm:mt-0'>


                    {/* Doctor name + verified icon */}

                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>

                        {/* Display doctor's name */}

                        {docInfo.name}


                        {/* Display verified icon */}

                        <img
                            className='w-5'
                            src={assets.verified_icon}
                            alt="verified"
                        />

                    </p>


                    {/* Doctor degree + speciality + experience */}

                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>

                        <p>
                            {docInfo.degree} - {docInfo.speciality}
                        </p>


                        {/* Doctor's experience */}

                        <button className='py-0.5 px-2 border text-xs rounded-full'>
                            {docInfo.experience}
                        </button>

                    </div>


                    {/* ---------------- ABOUT DOCTOR ---------------- */}

                    <div className='mt-4'>

                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900'>

                            About

                            <img
                                className='w-4'
                                src={assets.info_icon}
                                alt="info"
                            />

                        </p>


                        {/* Doctor description */}

                        <p className='text-sm text-gray-600 mt-1 break-words whitespace-pre-line'>
                            {docInfo.about}
                        </p>

                    </div>


                    {/* ---------------- APPOINTMENT FEE ---------------- */}

                    <p className='text-gray-600 font-medium mt-4'>

                        Appointment fee:{' '}

                        <span className='text-gray-900'>

                            {/* Currency symbol */}

                            {currencySymbol}{' '}

                            {/* Doctor's appointment fee */}

                            {docInfo.fees}

                        </span>

                    </p>

                </div>

            </div>


            {/* ==================================================
                BOOKING SLOTS
            ================================================== */}

            <div className='sm:ml-4 sm:pl-4 mt-4 font-medium text-gray-700'>

                <p>Booking Slots</p>


                {/* ==================================================
                    DAY SELECTOR
                ================================================== */}

                <div className='relative mt-4'>


                    <div className='flex items-center gap-3 w-full overflow-x-auto pb-2 pr-4 scrollbar-hide snap-x snap-mandatory'>


                        {/* ------------------------------------------------
                            LOOP THROUGH ALL 7 DAYS
                        ------------------------------------------------ */}

                        {docSlots.length > 0 &&

                            docSlots.map((item, index) => (

                                <div

                                    // When the user clicks this day,
                                    // save its index.
                                    //
                                    // Example:
                                    // Clicking second day:
                                    // slotIndex = 1

                                    onClick={() => setSlotIndex(index)}

                                    // React needs a unique key
                                    // when rendering lists.

                                    key={index}

                                    className={`flex flex-col items-center justify-center gap-1
                                        flex-shrink-0 w-16 py-4 rounded-full cursor-pointer transition-colors snap-start

                                        ${
                                            slotIndex === index

                                                // If this day is selected:
                                                // highlight it

                                                ? 'bg-primary text-white'

                                                // Otherwise:
                                                // show border

                                                : 'border border-gray-300 text-gray-500'
                                        }`}
                                >


                                    {/* ---------------- DAY NAME ---------------- */}

                                    <p className='text-xs uppercase'>

                                        {
                                            // item[0] = first appointment
                                            // of this particular day.
                                            //
                                            // We use it to find the date.
                                            //
                                            // item[0] && prevents an error
                                            // if there are no slots.

                                            item[0] &&
                                            daysOfWeek[
                                                item[0].datetime.getDay()
                                            ]
                                        }

                                    </p>


                                    {/* ---------------- DATE NUMBER ---------------- */}

                                    <p className='text-sm font-semibold'>

                                        {
                                            // Example:
                                            // August 5 -> 5

                                            item[0] &&
                                            item[0].datetime.getDate()
                                        }

                                    </p>

                                </div>

                            ))
                        }

                    </div>


                    {/* Right-side fade effect.
                        This visually indicates that more days
                        can be horizontally scrolled.

                        pointer-events-none means this element
                        won't block clicks. */}

                    <div className='pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent' />

                </div>


                {/* ==================================================
                    TIME SLOT SELECTOR
                ================================================== */}

                <div className='relative mt-4'>


                    <div className='flex items-center gap-3 w-full overflow-x-auto pb-2 pr-4 scrollbar-hide snap-x snap-mandatory'>


                        {
                            // Check whether slots exist.

                            docSlots.length > 0 &&

                            // Get the slots belonging to
                            // the currently selected day.
                            //
                            // Example:
                            //
                            // slotIndex = 2
                            //
                            // docSlots[2]
                            // = third day's slots

                            docSlots[slotIndex]?.map((item, index) => (

                                <p

                                    // When user clicks a time,
                                    // save that time in slotTime.

                                    onClick={() => setSlotTime(item.time)}

                                    key={index}

                                    className={`flex-shrink-0 text-sm font-light px-5 py-2 rounded-full cursor-pointer transition-colors snap-start

                                        ${
                                            item.time === slotTime

                                                // If this time is selected,
                                                // highlight it.

                                                ? 'bg-primary text-white'

                                                // Otherwise show normal border.

                                                : 'text-gray-500 border border-gray-300'
                                        }`}
                                >

                                    {
                                        // Convert:
                                        // "04:30 PM"
                                        //
                                        // into:
                                        // "04:30 pm"

                                        item.time.toLowerCase()
                                    }

                                </p>

                            ))
                        }

                    </div>


                    {/* ==================================================
                        BOOK APPOINTMENT BUTTON
                    ================================================== */}

                    <button
                        // Runs bookAppointment() when clicked.
                        // See the bookAppointment function above for
                        // what happens with the selected date/time.

                        onClick={bookAppointment}

                        className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'
                    >

                        Book an appointment

                    </button>


                    {/* Right-side fade effect for time slots */}

                    <div className='pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent' />

                </div>

            </div>


            {/* ==================================================
                RELATED DOCTORS
            ================================================== */}

            {/*

                Send the current doctor's ID and speciality
                to the RelatedDoctors component.

                docId:
                    tells RelatedDoctors which doctor is currently
                    being viewed.

                speciality:
                    allows RelatedDoctors to show doctors with
                    the same speciality.

            */}

            <RelatedDoctors
                docId={docId}
                speciality={docInfo.speciality}
            />

        </div>
    )
}