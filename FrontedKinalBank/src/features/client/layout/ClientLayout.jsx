import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore.js";

export const ClientLayout = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    const navItems = [
        { to: "/dashboard/client", label: "Inicio", icon: "🏠", end: true },
        { to: "/dashboard/client/accounts", label: "Mis Cuentas", icon: "💳" },
        { to: "/dashboard/client/transactions", label: "Movimientos", icon: "📋" },
        { to: "/dashboard/client/transfer", label: "Transferir", icon: "↗️" },
    ];

    return (
        <div className="h-screen w-screen bg-gray-50 flex flex-col overflow-hidden">
            {/* Navbar */}
            <header className="h-[60px] bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-50 border-b border-white/[0.06] flex-shrink-0">
                <div className="cursor-pointer flex items-center" onClick={() => navigate("/dashboard/client")}>
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

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-slate-900 flex flex-col overflow-y-auto flex-shrink-0">
                    <div className="p-6">
                        <h1 className="text-sm font-bold text-white mb-0.5">KinalBank</h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-8">
                            Mi Banca
                        </p>

                        <nav className="space-y-1">
                            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3 pt-2 pb-1">
                                Principal
                            </p>

                            {navItems.slice(0, 2).map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                                            isActive
                                                ? "bg-white/10 text-white border-l-4 border-indigo-500 pl-2"
                                                : "text-white/60 hover:bg-white/5 hover:text-white"
                                        }`
                                    }
                                >
                                    <span className="text-base leading-none">{item.icon}</span>
                                    {item.label}
                                </NavLink>
                            ))}

                            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3 pt-4 pb-1">
                                Operaciones
                            </p>

                            {navItems.slice(2).map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                                            isActive
                                                ? "bg-white/10 text-white border-l-4 border-indigo-500 pl-2"
                                                : "text-white/60 hover:bg-white/5 hover:text-white"
                                        }`
                                    }
                                >
                                    <span className="text-base leading-none">{item.icon}</span>
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Contenido */}
                <main className="flex-1 bg-gray-50 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};