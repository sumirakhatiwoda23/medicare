import React, { useState, useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
// axios: library used to make HTTP requests to your backend API

export default function Login() {

    const [state, setState] = useState('Admin')
    // state: tracks whether the form is in "Admin" mode or "Doctor" mode.
    // Same UI is reused for both — this decides which login flow runs and what label shows.

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // Controlled input state — holds whatever the user types into each field.
    // "Controlled" means the input's displayed value always comes from React state,
    // not from the DOM itself — that's why value={email} is paired with onChange.

    const { setAToken, backendUrl } = useContext(AdminContext)
    // Pulls two things out of your global AdminContext:
    // - setAToken: function to update the shared admin token in context
    // - backendUrl: your API's base URL, so this component doesn't hardcode it

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        // Stops the browser's default behavior of reloading the page on form submit

        try {

            if (state === 'Admin') {
                // Only runs this block if the form is currently in Admin mode

                const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
                // Sends a POST request to your backend's admin login endpoint,
                // with the email and password as the request body.
                // { data } pulls just the "data" field out of axios's response object.

                if (data.success) {
                    // Backend confirms login was successful and (presumably) returned a token

                    localStorage.setItem('aToken', data.token)
                    // Saves the token into the browser's localStorage under the key 'aToken'.
                    // This is what makes the login "persist" — even if the user refreshes
                    // the page, the token stays saved in the browser (unlike React state,
                    // which resets to nothing on every reload).

                    setAToken(data.token)
                    // Also updates the token in your React Context (in-memory, for this session).
                    // You need BOTH: localStorage for persistence across refreshes,
                    // and context state so the rest of your currently-running app
                    // immediately reacts to the new logged-in state without needing a reload.

                    console.log(data.token)
                    // Just a debug log so you can visually confirm the token during development
                }
                else{
                    toast.error(data.message)
                }

            } else {
                // Doctor mode — currently empty, meant to hold a separate doctor-login
                // API call later (not implemented yet)
            }

        } catch (error) {
            // Currently empty — if the request fails (wrong password, server down, etc.),
            // nothing happens visibly to the user. Worth adding error handling/feedback later,
            // but not touching that since you asked me not to add anything extra.
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center '>
            {/* onSubmit fires when the Login button (a default type="submit" button) is clicked */}

            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-100 rounded-xl text-[#5E5E5E] text-sm shadow-lg'>

                <p className='text-2xl font-semibold m-auto'>
                    <span className='text-primary'>{state}</span> Login
                </p>
                {/* Dynamically displays "Admin Login" or "Doctor Login" based on current state */}

                <div className='w-full'>
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        // Fires on every keystroke, updating email state with whatever's typed
                        value={email}
                        // The input always displays exactly what's in state (controlled input)
                        className='border border-[#DADADA] rounded w-full p-2 mt-1'
                        type="email"
                        required
                        // Browser won't let the form submit if this field is empty
                    />
                </div>

                <div className='w-full'>
                    <p className='w-full'>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='border border-[#DADADA] rounded w-full p-2 mt-1'
                        type="password"
                        required
                    />
                </div>

                <button className='bg-primary text-white w-full py-2 rounded-md text-base'>
                    Login
                </button>
                {/* No explicit type="submit" needed — buttons inside a <form> default to
                    type="submit", which is what triggers onSubmitHandler above */}

                {
                    state === 'Admin'
                        ? <p>Doctor Login ? <span className='text-primary underline cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></p>
                        : <p>Admin Login ? <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')}>Click here</span></p>
                }
                {/* Toggle link that flips the form between Admin and Doctor mode by
                    updating `state` — this re-renders the label above and changes which
                    branch of onSubmitHandler will run on the next submit */}
            </div>
        </form>
    )
}