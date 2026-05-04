import { Link, useLocation } from "react-router-dom"

const items = [
    {
        label: "Usuarios",
        to: "/dashboard/users",
        icon: (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 16a6 6 0 10-12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M16 14a4 4 0 00-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
        )
    },
    {
        label: "Cuentas bancarias",
        to: "/dashboard/accounts",
        icon: (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="7" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 7V5a5 5 0 0110 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="10" cy="12" r="1.5" fill="currentColor"/>
            </svg>
        )
    },
]

export const Sidebar = () => {
    const location = useLocation()

    return (
        <aside style={{
            width: 220, background: "#0f172a", minHeight: "calc(100vh - 60px)",
            padding: "20px 12px", flexShrink: 0,
            borderRight: "1px solid rgba(255,255,255,0.06)",
        }}>
            <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
                padding: "0 12px", marginBottom: 8,
            }}>
                Panel
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                {items.map((item) => {
                    const active = location.pathname === item.to
                    return (
                        <li key={item.to}>
                            <Link to={item.to} style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "9px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                                textDecoration: "none", transition: "all 150ms",
                                background: active ? "rgba(255,255,255,0.1)" : "transparent",
                                color: active ? "#fff" : "rgba(255,255,255,0.5)",
                                borderLeft: active ? "3px solid #6366f1" : "3px solid transparent",
                            }}>
                                {item.icon}
                                {item.label}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </aside>
    )
}