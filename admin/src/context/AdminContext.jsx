import { createContext, useState } from "react"
// createContext: React's tool for building a "global store" that any component can read from,
// without passing props down manually through every level (avoids "prop drilling").
// useState: lets us hold a piece of data that can change and trigger re-renders.


export const AdminContext = createContext()
// Creates the actual Context object. Think of it as an empty "container" for now —
// it doesn't hold any data yet, it's just the channel that data will flow through.
// Exported so any component in the app can import AdminContext and "tap into" it later.


const AdminContextProvider = (props) => {
    // This is a wrapper component. Its whole job is to hold the real admin-related data
    // and make it available to every component nested inside it via {props.children}.

    const [aToken, setAToken] = useState('')
    // aToken: the admin's authentication token (like a login session key).
    // Starts as an empty string '' — meaning "not logged in yet."
    // Once the admin logs in successfully, setAToken('someRealTokenString') updates this,
    // and every component using this context instantly sees the new value.

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    // Reads an environment variable — the backend API's base URL (e.g. "https://api.example.com").
    // import.meta.env is how Vite (your build tool) exposes .env file variables to your code.
    // Prefixing it with VITE_ is required — Vite only exposes env vars that start with "VITE_"
    // to the frontend, for security (so you don't accidentally leak secret keys).

    const value = {
        aToken, setAToken,
        backendUrl
    }
    // Bundles everything we want to share into one object.
    // Any component using this context will get access to:
    //   - aToken (read the current token)
    //   - setAToken (update the token, e.g. on login/logout)
    //   - backendUrl (know where to send API requests)

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
        // AdminContext.Provider is what actually "broadcasts" the value object
        // to every component nested inside it.
        // {props.children} represents whatever components get wrapped by
        // <AdminContextProvider> in your app tree — e.g. your whole <App /> or admin routes —
        // so all of them (and their children, and their children's children, etc.)
        // can access aToken, setAToken, and backendUrl without needing props passed manually.
    )
}

export default AdminContextProvider
// Exported as default so you can import it wherever you set up your app,
// typically wrapping it around your admin routes/pages like:
//   <AdminContextProvider>
//       <AdminApp />
//   </AdminContextProvider>