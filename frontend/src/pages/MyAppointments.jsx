import { AppContext } from '@/context/AppContext'
import React, { useContext, useState } from 'react'

export default function MyAppointments() {

  const { doctors } = useContext(AppContext)

  const [selectedButton, setSelectedButton] = useState(null)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      <p className="pb-4 mt-4 font-medium text-zinc-700 border-b">
        My Appointments
      </p>

      <div className="mt-4">

        {
          doctors.slice(0, 3).map((item, index) => (

            <div
              className="flex flex-col sm:flex-row gap-5 sm:gap-6 py-6 border-b"
              key={index}
            >

              {/* Doctor Image */}
              <div className="shrink-0">
                <img
                  className="w-32 h-32 sm:w-36 sm:h-36 object-cover bg-indigo-50 rounded"
                  src={item.image}
                  alt={item.name}
                />
              </div>

              {/* Doctor Information */}
              <div className="flex-1 text-sm text-zinc-600">

                <p className="text-neutral-800 font-semibold text-base">
                  {item.name}
                </p>

                <p className="mt-1">
                  {item.speciality}
                </p>

                <p className="text-zinc-700 font-medium mt-3">
                  Address:
                </p>

                <p className="text-xs mt-1">
                  {item.address.line1}
                </p>

                <p className="text-xs">
                  {item.address.line2}
                </p>

                <p className="text-xs mt-2">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date and Time:
                  </span>{' '}
                  25, July, 2024 | 8:30 PM
                </p>

              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 justify-end sm:w-48">

                {/* Pay Online */}
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

                {/* Cancel Appointment */}
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

              </div>

            </div>
          ))
        }

      </div>

    </div>
  )
}