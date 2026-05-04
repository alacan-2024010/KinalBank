import { Link, useLocation } from "react-router-dom"

export const Sidebar = () => {
    const location = useLocation()

    const items = [
        { label: "👥 Usuarios", to: "/dashboard/users" },
        { label: "🏦 Cuentas bancarias", to: "/dashboard/accounts" },
    ]

    return (
        <aside className="w-64 bg-white border-r border-slate-100 min-h-[calc(100vh-4rem)] p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">
                Menú
            </p>
            <ul className="space-y-1">
                {items.map((item) => {
                    const active = location.pathname === item.to
                    return (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                className={`block px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                                    active 
                                    ? "bg-slate-900 text-white" 
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </aside>
    )
}