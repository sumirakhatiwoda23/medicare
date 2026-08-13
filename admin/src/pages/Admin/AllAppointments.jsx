import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

export default function AllAppointments() {

  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)

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

  const calculateAge = (dob) => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    return age
  }

  // opens the confirmation modal instead of cancelling immediately
  const requestCancel = (appointmentId, patientName) => {
    setConfirmCancel({ appointmentId, patientName })
  }

  const handleConfirmCancel = async () => {
    if (!confirmCancel) return

    setProcessing(true)
    await cancelAppointment(confirmCancel.appointmentId)
    setProcessing(false)
    setConfirmCancel(null)
  }

  const handleCloseModal = () => {
    setConfirmCancel(null)
  }

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">

      <p className="mb-4 text-lg font-medium text-gray-700">
        All Appointments
      </p>

      <div className="bg-white border border-gray-200 rounded-lg text-sm max-h-[80vh] overflow-y-auto">

        {/* Table header — desktop only */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr_1fr] gap-2 py-3 px-6 border-b bg-gray-50 font-medium text-gray-600">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>
          <p>Action</p>
        </div>

        {
          appointments && appointments.length > 0 ? (
            appointments.map((item, index) => (
              <div
                key={item._id}
                className="flex flex-wrap sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr_1fr] gap-2 items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50"
              >
                <p className="hidden sm:block">{index + 1}</p>

                <div className="flex items-center gap-2">
                  <img
                    src={item.userData.image}
                    alt={item.userData.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <p>{item.userData.name}</p>
                </div>

                <p className="hidden sm:block">
                  {calculateAge(item.userData.dob)}
                </p>

                <p>
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>

                <div className="flex items-center gap-2">
                  <img
                    src={item.docData.image}
                    alt={item.docData.name}
                    className="w-8 h-8 rounded-full object-cover bg-gray-100"
                  />
                  <p>{item.docData.name}</p>
                </div>

                <p>{item.amount}</p>

                <div>
                  {item.cancelled ? (
                    <p className="text-red-400 text-xs font-medium">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-600 text-xs font-medium">Completed</p>
                  ) : item.payment ? (
                    <p className="text-green-600 text-xs font-medium">Paid</p>
                  ) : (
                    <p className="text-yellow-600 text-xs font-medium">Pending</p>
                  )}
                </div>

                <div>
                  {
                    item.cancelled
                      ? <p className="text-red-400 text-xs font-medium">Cancelled</p>
                      : item.isCompleted ? 
                      <p className="text-green-500 text-xs font-medium">Completed</p>
                      :
                      
                      <img
                          onClick={() => requestCancel(item._id, item.userData.name)}
                          className="w-10 cursor-pointer"
                          src={assets.cancel_icon}
                          alt="Cancel appointment"
                        />
                  }
                </div>

              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-10">
              No appointments found
            </p>
          )
        }

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