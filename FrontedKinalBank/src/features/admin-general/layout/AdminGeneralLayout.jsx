import { NavLink, Outlet } from "react-router-dom"
import { Navbar } from "../../../shared/components/layouts/Navbar.jsx"

export const AdminGeneralLayout = () => {
    return (
        <div className="h-screen w-screen bg-[#f4f7fb] flex flex-col overflow-hidden">

            <Navbar />

            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar */}
                <aside className="w-72 bg-[#071126] relative overflow-hidden flex flex-col flex-shrink-0 border-r border-white/5">

                    {/* Glow */}
                    <div className="absolute top-[-120px] right-[-120px] w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full" />
                    <div className="absolute bottom-[-100px] left-[-100px] w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />

                    <div className="relative z-10 flex flex-col h-full p-6">

                        {/* Navigation */}
                        <nav className="flex flex-col gap-7">

                            {/* Usuarios */}
                            <div>
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.25em] px-3 mb-3">
                                    Usuarios
                                </p>

                                <div className="space-y-2">

                                    <NavLink
                                        to="/dashboard/users"
                                        className={({ isActive }) =>
                                            `group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                                                isActive
                                                    ? "bg-gradient-to-r from-indigo-500/20 to-cyan-500/10 border border-indigo-400/20 shadow-lg shadow-indigo-500/10"
                                                    : "hover:bg-white/5 border border-transparent"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all ${
                                                    isActive
                                                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                                                        : "bg-white/5 text-slate-300 group-hover:bg-white/10"
                                                }`}>
                                                    👥
                                                </div>

                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-semibold ${
                                                        isActive ? "text-white" : "text-slate-300"
                                                    }`}>
                                                        Solicitudes
                                                    </span>

                                                    <span className="text-xs text-slate-500">
                                                        Usuarios pendientes
                                                    </span>
                                                </div>

                                                {isActive && (
                                                    <div className="ml-auto w-2 h-10 rounded-full bg-gradient-to-b from-indigo-400 to-cyan-400" />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                </div>
                            </div>

                            {/* Finanzas */}
                            <div>
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.25em] px-3 mb-3">
                                    Finanzas
                                </p>

                                <div className="space-y-2">

                                    <NavLink
                                        to="/dashboard/accounts"
                                        className={({ isActive }) =>
                                            `group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                                                isActive
                                                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-400/20 shadow-lg shadow-emerald-500/10"
                                                    : "hover:bg-white/5 border border-transparent"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all ${
                                                    isActive
                                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                                        : "bg-white/5 text-slate-300 group-hover:bg-white/10"
                                                }`}>
                                                    🏦
                                                </div>

                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-semibold ${
                                                        isActive ? "text-white" : "text-slate-300"
                                                    }`}>
                                                        Cuentas
                                                    </span>

                                                    <span className="text-xs text-slate-500">
                                                        Gestión bancaria
                                                    </span>
                                                </div>

                                                {isActive && (
                                                    <div className="ml-auto w-2 h-10 rounded-full bg-gradient-to-b from-emerald-400 to-teal-400" />
                                                )}
                                            </>
                                        )}
                                    </NavLink>

                                    <NavLink
                                        to="/dashboard/deposits"
                                        className={({ isActive }) =>
                                            `group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                                                isActive
                                                    ? "bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-400/20 shadow-lg shadow-orange-500/10"
                                                    : "hover:bg-white/5 border border-transparent"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all ${
                                                    isActive
                                                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                                                        : "bg-white/5 text-slate-300 group-hover:bg-white/10"
                                                }`}>
                                                    💰
                                                </div>

                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-semibold ${
                                                        isActive ? "text-white" : "text-slate-300"
                                                    }`}>
                                                        Depósitos
                                                    </span>

                                                    <span className="text-xs text-slate-500">
                                                        Movimientos
                                                    </span>
                                                </div>

                                                {isActive && (
                                                    <div className="ml-auto w-2 h-10 rounded-full bg-gradient-to-b from-orange-400 to-amber-400" />
                                                )}
                                            </>
                                        )}
                                    </NavLink>

                                </div>
                            </div>

                        </nav>

                        {/* Footer */}
                        <div className="mt-auto pt-6">
                            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
                                <p className="text-white font-semibold text-sm mb-1">
                                    Sistema bancario
                                </p>

                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Panel administrativo moderno para la gestión de usuarios y finanzas.
                                </p>

                                <div className="mt-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs text-emerald-300">
                                        Sistema activo
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </aside>

                {/* Contenido */}
                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#f8fafc] to-[#eef4ff] p-8">
                    <Outlet />
                </main>

            </div>
        </div>
    )
}