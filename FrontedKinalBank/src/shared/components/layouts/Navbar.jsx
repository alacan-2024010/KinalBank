import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../features/auth/store/authStore"

export const Navbar = () => {
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)

    const handleLogout = () => {
        logout()
        navigate("/", { replace: true })
    }

    return (
        <header style={{
            height: 60, background: "#0f172a", display: "flex",
            alignItems: "center", justifyContent: "space-between",
            padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
            borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
        }}>
            <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                onClick={() => navigate("/dashboard")}>
                <img src="/src/assets/img/KinalBank.png" alt="KinalBank"
                    style={{ height: 36, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
            </div>
            <button onClick={handleLogout} style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "7px 16px",
                fontSize: 13, cursor: "pointer", fontWeight: 500, transition: "all 150ms",
            }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            >
                Cerrar sesión
            </button>
        </header>
    )
}