import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
            <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
                <div className="px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
                        <img 
                            src="/src/assets/img/KinalBank.png" 
                            alt="KinalBank" 
                            className="h-10 w-auto object-contain"
                        />
                    </div>
                    {/* Logout */}
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </nav>
        </nav>
    )
}