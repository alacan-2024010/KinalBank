import { Routes, Route } from 'react-router-dom'
import { AuthPage } from '../../features/auth/pages/AuthPage'
import { Toaster } from "react-hot-toast"

export const AppRoutes = () => {
    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/" element={<AuthPage />} />
            </Routes>
        </>
    )
}