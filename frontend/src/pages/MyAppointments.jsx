import { AppContext } from '@/context/AppContext'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function MyAppointments() {

  const { backendUrl, token } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [selectedButton, setSelectedButton] = useState(null)

  const months = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/user/appointments',
        { headers: { token } }
      )

      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      <p className="pb-4 mt-4 font-medium text-zinc-700 border-b">
        My Appointments
      </p>

      <div className="mt-4">

        {
          appointments.map((item, index) => (

            <div
              className="flex flex-col sm:flex-row gap-5 sm:gap-6 py-6 border-b"
              key={index}
            >

              {/* Doctor Image */}
              <div className="shrink-0">
                <img
                  className="w-32 h-32 sm:w-36 sm:h-36 object-cover bg-indigo-50 rounded"
                  src={item.docData.image}
                  alt={item.docData.name}
                />
              </div>

              {/* Doctor Information */}
              <div className="flex-1 text-sm text-zinc-600">

                <p className="text-neutral-800 font-semibold text-base">
                  {item.docData.name}
                </p>

                <p className="mt-1">
                  {item.docData.speciality}
                </p>

                <p className="text-zinc-700 font-medium mt-3">
                  Address:
                </p>

                <p className="text-xs mt-1">
                  {item.docData.address.line1}
                </p>

                <p className="text-xs">
                  {item.docData.address.line2}
                </p>

                <p className="text-xs mt-2">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date and Time:
                  </span>{' '}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>

              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 justify-end sm:w-48">

                {!item.cancelled && !item.isCompleted && (
                  <>
                    <button
                      onClick={() => setSelectedButton(`pay-${index}`)}
                      className={`text-sm text-center w-full py-2.5 border rounded transition-all duration-300 ${
                        selectedButton === `pay-${index}`
                          ? 'bg-primary text-white border-primary'
                          : 'text-stone-500 border-stone-300 hover:bg-primary hover:text-white'
                      }`}
                    >
                      Pay Online
                    </button>

                    <button
                      onClick={() => setSelectedButton(`cancel-${index}`)}
                      className={`text-sm text-center w-full py-2.5 border rounded transition-all duration-300 ${
                        selectedButton === `cancel-${index}`
                          ? 'bg-red-600 text-white border-red-600'
                          : 'text-stone-500 border-stone-300 hover:bg-red-600 hover:text-white'
                      }`}
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}

                {item.cancelled && (
                  <button className="text-sm text-center w-full py-2.5 border border-red-500 rounded text-red-500">
                    Appointment cancelled
                  </button>
                )}

                {item.isCompleted && (
                  <button className="text-sm text-center w-full py-2.5 border border-green-500 rounded text-green-500">
                    Completed
                  </button>
                )}

              </div>

            </div>
          ))
        }

      </div>

    </div>
  )
}