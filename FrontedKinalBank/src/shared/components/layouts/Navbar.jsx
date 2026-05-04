import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../../features/auth/store/authStore.js"

export const Navbar = () => {
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)

    const handleLogout = () => {
        logout()
        navigate("/", { replace: true })
    }

    return (
        <header className="h-[60px] bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-50 border-b border-white/[0.06] flex-shrink-0">
            <div className="cursor-pointer flex items-center" onClick={() => navigate("/dashboard")}>
                <img
                    src="/src/assets/img/KinalBank.png"
                    alt="KinalBank"
                    className="h-9 object-contain brightness-0 invert"
                />
            </div>
            <button
                onClick={handleLogout}
                className="bg-white/[0.06] border border-white/10 text-white/70 rounded-lg px-4 py-1.5 text-sm font-medium cursor-pointer transition-all hover:bg-white/[0.12]"
            >
                Cerrar sesión
            </button>
        </header>
    )
}