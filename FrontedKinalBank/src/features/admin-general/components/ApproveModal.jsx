import { useState } from "react"

export const ApproveModal = ({ user, onClose, onConfirm, loading }) => {
    const [role, setRole] = useState("CLIENT")

    const fields = [
        ["Usuario", user.Username],
        ["DPI", user.DPI],
        ["Teléfono", user.Phone],
        ["Trabajo", user.Job],
        ["Ingreso mensual", `Q ${Number(user.MonthlyIncome || 0).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`],
        ["Dirección", user.Address],
    ]

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 200, padding: 16,
        }}>
            <div style={{
                background: "#fff", borderRadius: 14, width: "100%", maxWidth: 500,
                border: "1px solid #e2e8f0", overflow: "hidden",
            }}>
                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "18px 24px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc",
                }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8" }}>
                        Aprobar solicitud
                    </span>
                    <button onClick={onClose} style={{
                        background: "none", border: "none", fontSize: 18,
                        cursor: "pointer", color: "#94a3b8", lineHeight: 1, padding: 4,
                    }}>×</button>
                </div>

                {/* User info */}
                <div style={{ padding: "20px 24px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: "50%",
                            background: "#eef2ff", color: "#4f46e5",
                            fontWeight: 700, fontSize: 16,
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            {user.Name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 15 }}>{user.Name}</div>
                            <div style={{ color: "#64748b", fontSize: 13 }}>{user.Email}</div>
                        </div>
                    </div>

                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                        gap: "12px 20px", background: "#f8fafc",
                        borderRadius: 8, padding: 16, marginBottom: 16,
                        border: "1px solid #f1f5f9",
                    }}>
                        {fields.map(([label, val]) => (
                            <div key={label}>
                                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 2 }}>{label}</div>
                                <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{val}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b", display: "block", marginBottom: 6 }}>
                            Asignar rol
                        </label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} style={{
                            width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0",
                            borderRadius: 8, fontSize: 13, color: "#0f172a",
                            background: "#fff", outline: "none", cursor: "pointer",
                        }}>
                            <option value="CLIENT">CLIENT</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    display: "flex", justifyContent: "flex-end", gap: 10,
                    padding: "16px 24px", borderTop: "1px solid #f1f5f9", background: "#f8fafc",
                }}>
                    <button onClick={onClose} style={{
                        padding: "9px 18px", borderRadius: 8, border: "1px solid #e2e8f0",
                        background: "#fff", fontSize: 13, cursor: "pointer", color: "#475569", fontWeight: 500,
                    }}>
                        Cancelar
                    </button>
                    <button onClick={() => onConfirm(user.Id, role)} disabled={loading} style={{
                        padding: "9px 18px", borderRadius: 8, border: "none",
                        background: loading ? "#a5b4fc" : "#4f46e5",
                        color: "#fff", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                        transition: "background 150ms",
                    }}>
                        {loading ? "Aprobando…" : "✓ Aprobar"}
                    </button>
                </div>
            </div>
        </div>
    )
}