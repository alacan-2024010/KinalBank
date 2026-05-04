import { useState } from "react";

export const ApproveModal = ({ user, onClose, onConfirm, loading }) => {
  const [role, setRole] = useState("CLIENT");

  return (
    <div style={overlay}>
      <div style={card}>
        <div style={cardHeader}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>
            Aprobar solicitud
          </span>
          <button onClick={onClose} style={closeBtn}>×</button>
        </div>

        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={avatar}>{user.Name?.charAt(0).toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 16 }}>{user.Name}</div>
              <div style={{ color: "#64748b", fontSize: 13 }}>{user.Email}</div>
            </div>
          </div>

          <div style={infoGrid}>
            {[
              ["Usuario", user.Username],
              ["DPI", user.DPI],
              ["Teléfono", user.Phone],
              ["Trabajo", user.Job],
              ["Ingreso mensual", `Q ${Number(user.MonthlyIncome || 0).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`],
              ["Dirección", user.Address],
            ].map(([label, val]) => (
              <div key={label} style={infoCell}>
                <span style={infoLabel}>{label}</span>
                <span style={infoVal}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <label style={fieldLabel}>Asignar rol</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={selectStyle}>
              <option value="CLIENT">CLIENT</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>

        <div style={cardFooter}>
          <button onClick={onClose} style={btnSecondary}>Cancelar</button>
          <button onClick={() => onConfirm(user.Id, role)} disabled={loading} style={btnApprove}>
            {loading ? "Aprobando…" : "✓ Aprobar usuario"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Estilos ──────────────────────────────────────────────
const overlay = {
  position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
};
const card = {
  background: "#fff", borderRadius: 12, width: "100%", maxWidth: 520,
  boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden",
};
const cardHeader = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "16px 28px", borderBottom: "1px solid #f1f5f9",
};
const closeBtn = {
  background: "none", border: "none", fontSize: 20, cursor: "pointer",
  color: "#94a3b8", lineHeight: 1,
};
const avatar = {
  width: 40, height: 40, borderRadius: "50%", background: "#e0e7ff",
  color: "#4f46e5", fontWeight: 700, fontSize: 16,
  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
};
const infoGrid = {
  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px",
};
const infoCell = { display: "flex", flexDirection: "column", gap: 2 };
const infoLabel = { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8" };
const infoVal = { fontSize: 13, color: "#0f172a", fontWeight: 500 };
const fieldLabel = { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", display: "block", marginBottom: 6 };
const selectStyle = {
  width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0",
  borderRadius: 6, fontSize: 13, color: "#0f172a", background: "#f8fafc", outline: "none",
};
const cardFooter = {
  display: "flex", justifyContent: "flex-end", gap: 10,
  padding: "16px 28px", borderTop: "1px solid #f1f5f9", background: "#f8fafc",
};
const btnSecondary = {
  padding: "9px 18px", borderRadius: 6, border: "1px solid #e2e8f0",
  background: "#fff", fontSize: 13, cursor: "pointer", color: "#475569",
};
const btnApprove = {
  padding: "9px 18px", borderRadius: 6, border: "none",
  background: "#4f46e5", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
};