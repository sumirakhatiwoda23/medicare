import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

export default function Dashboard() {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)

  // confirmation modal state
  const [confirmCancel, setConfirmCancel] = useState(null)
  // shape: { appointmentId, patientName }

  const [processing, setProcessing] = useState(false)

  const months = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const requestCancel = (appointmentId, patientName) => {
    setConfirmCancel({ appointmentId, patientName })
  }

  const handleConfirmCancel = async () => {
    if (!confirmCancel) return

    setProcessing(true)
    await cancelAppointment(confirmCancel.appointmentId)
    await getDashData()
    setProcessing(false)
    setConfirmCancel(null)
  }

  const handleCloseModal = () => {
    setConfirmCancel(null)
  }

  useEffect(() => {

    if (aToken) {
      getDashData()
    }

  }, [aToken])

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>

        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-all'>
          <div className='bg-indigo-50 p-3 rounded-lg'>
            <img className='w-8' src={assets.doctor_icon} alt="" />
          </div>
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.doctors}</p>
            <p className='text-gray-400 text-sm'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-all'>
          <div className='bg-indigo-50 p-3 rounded-lg'>
            <img className='w-8' src={assets.appointments_icon} alt="" />
          </div>
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.appointments}</p>
            <p className='text-gray-400 text-sm'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-all'>
          <div className='bg-indigo-50 p-3 rounded-lg'>
            <img className='w-8' src={assets.patients_icon} alt="" />
          </div>
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.patients}</p>
            <p className='text-gray-400 text-sm'>Patients</p>
          </div>
        </div>

      </div>

      <div className='bg-white mt-10 rounded-xl border border-gray-100 shadow-sm'>

        <div className='flex items-center gap-2.5 px-5 py-4 border-b border-gray-100'>
          <img className='w-5' src={assets.list_icon} alt="" />
          <p className='font-semibold text-gray-800'>Latest Appointment</p>
        </div>

        <div>
          {dashData.latestAppointments.map((item, index) => (
            <div className='flex items-center px-5 py-3 gap-3 hover:bg-gray-50' key={index}>
              <img className='rounded-full w-10 h-10 object-cover' src={item.docData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                <p className='text-gray-400'>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>

              {item.cancelled ? (
                <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-medium'>Completed</p>
              ) : (
                <img
                  onClick={() => requestCancel(item._id, item.docData.name)}
                  className='w-10 cursor-pointer'
                  src={assets.cancel_icon}
                  alt="Cancel appointment"
                />
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">

            <h3 className="text-base font-semibold text-gray-900">
              Cancel Appointment
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to cancel{' '}
              <span className="font-medium text-gray-900">{confirmCancel.patientName}</span>'s appointment? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                disabled={processing}
                className="text-sm px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
              >
                Go Back
              </button>

              <button
                onClick={handleConfirmCancel}
                disabled={processing}
                className="text-sm px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
              >
                {processing ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}