import { AppContext } from '@/context/AppContext'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { redirectToEsewa } from '@/utils/esewaCheckout'

export default function MyAppointments() {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [selectedButton, setSelectedButton] = useState(null)
  // tracks whether a payment/cancel request is in progress, to disable buttons during the call
  const [processing, setProcessing] = useState(false)

  // confirmation modal state
  const [confirmAction, setConfirmAction] = useState(null)
  // shape: { type: 'cancel' | 'pay', appointmentId, index, amount }

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
        setAppointments([...data.appointments].reverse())
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {

      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setProcessing(false)
    }
  }

  // initiates eSewa payment for an already-booked appointment, then redirects to eSewa's sandbox checkout
  const payWithEsewa = async (appointmentId, amount) => {

    setProcessing(true)

    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/esewa-initiate',
        { appointmentId, amount },
        { headers: { token } }
      )

      if (data.success) {
        redirectToEsewa(data.paymentData)
      } else {
        toast.error(data.message)
        setProcessing(false)
        setSelectedButton(null)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
      setProcessing(false)
      setSelectedButton(null)
    }
  }

  // called when user clicks "Cancel appointment" or "Pay Online" — opens modal instead of acting immediately
  const requestConfirmation = (type, appointmentId, index, amount) => {
    setConfirmAction({ type, appointmentId, index, amount })
  }

  // called when user confirms inside the modal
  const handleConfirm = () => {
    if (!confirmAction) return

    if (confirmAction.type === 'cancel') {
      setProcessing(true)
      cancelAppointment(confirmAction.appointmentId)
      setConfirmAction(null)
    } else if (confirmAction.type === 'pay') {
      setSelectedButton(`pay-${confirmAction.index}`)
      payWithEsewa(confirmAction.appointmentId, confirmAction.amount)
      setConfirmAction(null)
    }
  }

  const handleCancelModal = () => {
    setConfirmAction(null)
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
                  src={item.docData?.image}
                  alt={item.docData?.name}
                />
              </div>

              {/* Doctor Information */}
              <div className="flex-1 text-sm text-zinc-600">

                <p className="text-neutral-800 font-semibold text-base">
                  {item.docData?.name}
                </p>

                <p className="mt-1">
                  {item.docData?.speciality}
                </p>

                <p className="text-zinc-700 font-medium mt-3">
                  Address:
                </p>

                <p className="text-xs mt-1">
                  {item.docData?.address?.line1}
                </p>

                <p className="text-xs">
                  {item.docData?.address?.line2}
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

                {!item.cancelled && !item.isCompleted && !item.payment && (
                  <button
                    onClick={() => requestConfirmation('pay', item._id, index, item.amount)}
                    className={`text-sm text-center w-full py-2.5 border rounded transition-all duration-300 ${
                      selectedButton === `pay-${index}`
                        ? 'bg-primary text-white border-primary'
                        : 'text-stone-500 border-stone-300 hover:bg-primary hover:text-white'
                    }`}
                  >
                    Pay Online
                  </button>
                )}

                {item.payment && !item.cancelled && (
                  <button className="text-sm text-center w-full py-2.5 border border-green-500 rounded text-green-600">
                    Paid
                  </button>
                )}

                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => requestConfirmation('cancel', item._id, index)}
                    className="text-sm text-center w-full py-2.5 border rounded transition-all cursor-pointer duration-300 text-stone-500 border-stone-300 hover:bg-red-600 hover:text-white"
                  >
                    Cancel appointment
                  </button>
                )}

                {
                  item.cancelled && (
                    <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
                      Appointment cancelled
                    </button>
                  )
                }

              </div>

            </div>
          ))
        }

      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">

            <h3 className="text-base font-semibold text-neutral-800">
              {confirmAction.type === 'cancel'
                ? 'Cancel Appointment'
                : 'Proceed to Payment'}
            </h3>

            <p className="mt-2 text-sm text-zinc-600">
              {confirmAction.type === 'cancel'
                ? 'Are you sure you want to cancel this appointment? This action cannot be undone.'
                : `You are about to pay NPR ${confirmAction.amount} via eSewa for this appointment. Do you want to continue?`}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancelModal}
                disabled={processing}
                className="text-sm px-4 py-2 rounded border border-stone-300 text-stone-600 hover:bg-stone-100 transition-all duration-200 disabled:opacity-50"
              >
                Go Back
              </button>

              <button
                onClick={handleConfirm}
                disabled={processing}
                className={`text-sm px-4 py-2 rounded text-white transition-all duration-200 disabled:opacity-50 ${
                  confirmAction.type === 'cancel'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:opacity-90'
                }`}
              >
                {processing
                  ? 'Processing...'
                  : confirmAction.type === 'cancel'
                    ? 'Yes, Cancel'
                    : 'Confirm & Pay'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}