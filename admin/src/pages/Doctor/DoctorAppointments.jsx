import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'

export default function DoctorAppointments() {

  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  const calculateAge = (dob) => {
    if (!dob) return '-'
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    return age
  }

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return '-'
    const dateArray = slotDate.split('_')
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
  }

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>

        {/* Desktop header - hidden on mobile */}
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-1 py-3 px-6 border-b bg-gray-50 font-medium'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.length === 0 && (
          <p className='p-6 text-gray-500 text-center'>No appointments found</p>
        )}

        {appointments.map((item, index) => (
          <div key={index} className='px-4 sm:px-6'>

            {/* Mobile layout */}
            <div className='flex flex-col gap-2 sm:hidden py-3 border-b'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <img
                    src={item.userData?.image}
                    alt=""
                    className='w-8 h-8 rounded-full object-cover'
                  />
                  <p className='font-medium text-gray-800'>{item.userData?.name}</p>
                </div>
                <span className='border px-2 py-0.5 rounded-full text-xs'>
                  {item.payment ? 'Online' : 'CASH'}
                </span>
              </div>

              <div className='flex justify-between items-center text-gray-600'>
                <p className='text-xs'>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                <p className='text-xs font-medium'>${item.amount}</p>
              </div>

              {item.cancelled ? (
                <p className='text-red-500 text-xs font-medium'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-medium'>Completed</p>
              ) : (
                <div className='flex gap-2'>
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className='w-7 cursor-pointer'
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className='w-7 cursor-pointer'
                    src={assets.tick_icon}
                    alt="Complete"
                  />
                </div>
              )}
            </div>

            {/* Desktop layout */}
            <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-1 items-center text-gray-600 py-3 border-b hover:bg-green-50 transition-colors'>
              <p>{index + 1}</p>

              <div className='flex items-center gap-2'>
                <img
                  src={item.userData?.image}
                  alt=""
                  className='w-8 h-8 rounded-full object-cover'
                />
                <p>{item.userData?.name}</p>
              </div>

              <p>
                <span className='border px-2 py-1 rounded-full text-xs'>
                  {item.payment ? 'Online' : 'CASH'}
                </span>
              </p>

              <p>{calculateAge(item.userData?.dob)}</p>

              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

              <p>${item.amount}</p>

              {item.cancelled ? (
                <p className='text-red-500 text-xs font-medium'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-medium'>Completed</p>
              ) : (
                <div className='flex gap-2'>
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className='w-8 cursor-pointer'
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className='w-8 cursor-pointer'
                    src={assets.tick_icon}
                    alt="Complete"
                  />
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}