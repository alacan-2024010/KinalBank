import { useEffect, useState } from "react"
import { useUsersStore } from "../store/UserStore"
import { ApproveModal } from "../components/ApproveModal"

export const UsersPage = () => {
    const { pendingUsers = [], loading, error, getPendingUsers, approveUser, clearError } = useUsersStore()
    const [selected, setSelected] = useState(null)

    useEffect(() => { getPendingUsers() }, [])

    const handleApprove = async (userId, role) => {
        const result = await approveUser(userId, role)
        if (result?.success) setSelected(null)
    }

    return (
        <>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                        Solicitudes pendientes
                    </h1>
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>
                        {pendingUsers.length} usuario{pendingUsers.length !== 1 ? "s" : ""} esperando aprobación
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626",
                        borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13,
                    }}>
                        <span>{error}</span>
                        <button onClick={clearError} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, color: "#dc2626", fontSize: 16 }}>×</button>
                    </div>
                )}

                {/* Tabla */}
                <div style={{
                    background: "#fff", borderRadius: 12,
                    border: "1px solid #e2e8f0", overflow: "hidden",
                }}>
                    {loading && pendingUsers.length === 0 ? (
                        <div style={{ padding: "60px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                            Cargando solicitudes…
                        </div>
                    ) : pendingUsers.length === 0 ? (
                        <div style={{ padding: "60px 20px", textAlign: "center" }}>
                            <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
                            <div style={{ fontWeight: 600, color: "#475569", fontSize: 14 }}>Sin solicitudes pendientes</div>
                            <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>Todos los usuarios han sido procesados.</div>
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                        {["Nombre", "Usuario", "Correo", "DPI", "Teléfono", "Trabajo", "Ingreso", "Acciones"].map(h => (
                                            <th key={h} style={{
                                                padding: "12px 16px", textAlign: "left", fontSize: 10,
                                                fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8",
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingUsers.map((user, i) => (
                                        <tr key={user.Id} style={{
                                            borderBottom: "1px solid #f1f5f9",
                                            background: i % 2 === 0 ? "#fff" : "#fafafa",
                                            transition: "background 150ms",
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                                            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa"}
                                        >
                                            <td style={{ padding: "12px 16px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div style={{
                                                        width: 32, height: 32, borderRadius: "50%",
                                                        background: "#eef2ff", color: "#4f46e5",
                                                        fontWeight: 700, fontSize: 13,
                                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                                    }}>
                                                        {user.Name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: "#0f172a" }}>{user.Name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <span style={{ fontFamily: "monospace", fontSize: 12, background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 4 }}>
                                                    @{user.Username}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px 16px", color: "#475569" }}>{user.Email}</td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <span style={{ fontFamily: "monospace", fontSize: 12, background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 4 }}>
                                                    {user.DPI}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px 16px", color: "#475569" }}>{user.Phone}</td>
                                            <td style={{ padding: "12px 16px", color: "#475569" }}>{user.Job}</td>
                                            <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0f172a" }}>
                                                Q {Number(user.MonthlyIncome || 0).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <button onClick={() => setSelected(user)} style={{
                                                    padding: "6px 14px", borderRadius: 6,
                                                    border: "1px solid #e0e7ff", background: "#eef2ff",
                                                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                                                    color: "#4f46e5", transition: "all 150ms",
                                                }}
                                                    onMouseEnter={e => e.currentTarget.style.background = "#e0e7ff"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "#eef2ff"}
                                                >
                                                    Revisar →
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {selected && (
                <ApproveModal
                    user={selected}
                    onClose={() => setSelected(null)}
                    onConfirm={handleApprove}
                    loading={loading}
                />
            )}
        </>
    )
}