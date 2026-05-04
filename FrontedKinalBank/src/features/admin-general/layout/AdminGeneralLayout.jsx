import { NavLink, Outlet } from "react-router-dom"
import { Navbar } from "../../../shared/components/layouts/Navbar.jsx"

export const AdminGeneralLayout = () => {
    return (
        <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">

            <Navbar />

            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar */}
                <aside className="w-64 bg-slate-900 flex flex-col overflow-y-auto flex-shrink-0">
                    <div className="p-6">
                        <h1 className="text-sm font-bold text-white mb-0.5">KinalBank</h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-8">
                            Panel Admin
                        </p>

                        <nav className="space-y-1">
                            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3 pt-2 pb-1">
                                Usuarios
                            </p>

                            <NavLink
                                to="/dashboard/users"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                                        isActive
                                            ? "bg-white/10 text-white border-l-4 border-indigo-500 pl-2"
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                    }`
                                }
                            >
                                <span className="text-base leading-none">👥</span>
                                Solicitudes
                            </NavLink>

                            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3 pt-4 pb-1">
                                Finanzas
                            </p>

                            <NavLink
                                to="/dashboard/accounts"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                                        isActive
                                            ? "bg-white/10 text-white border-l-4 border-indigo-500 pl-2"
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                    }`
                                }
                            >
                                <span className="text-base leading-none">🏦</span>
                                Cuentas
                            </NavLink>
                        </nav>
                    </div>
                </aside>

                {/* Contenido */}
                <main className="flex-1 bg-gray-50 overflow-y-auto p-8">
                    <Outlet />
                </main>

            </div>
        </div>
    )
}