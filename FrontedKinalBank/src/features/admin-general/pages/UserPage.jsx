// front/src/features/admin-general/pages/UsersPage.jsx
import { useEffect, useState } from "react";
import { useUsersStore } from "../store/usersStore.js";

/* ─── Confirm Modal ─────────────────────────────────────── */
const ApproveModal = ({ user, onClose, onConfirm, loading }) => {
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
          {/* Avatar + nombre */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={avatar}>{user.Name?.charAt(0).toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 16 }}>{user.Name}</div>
              <div style={{ color: "#64748b", fontSize: 13 }}>{user.Email}</div>
            </div>
          </div>

          {/* Info grid */}
          <div style={infoGrid}>
            {[
              ["Usuario", user.Username],
              ["DPI", user.DPI],
              ["Teléfono", user.Phone],
              ["Trabajo", user.Job],
              ["Ingreso mensual", `Q ${Number(user.MonthlyIncome).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`],
              ["Dirección", user.Address],
            ].map(([label, val]) => (
              <div key={label} style={infoCell}>
                <span style={infoLabel}>{label}</span>
                <span style={infoVal}>{val}</span>
              </div>
            ))}
          </div>

          {/* Rol */}
          <div style={{ marginTop: 20 }}>
            <label style={fieldLabel}>Asignar rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={selectStyle}
            >
              <option value="CLIENT">CLIENT</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>

        <div style={cardFooter}>
          <button onClick={onClose} style={btnSecondary}>Cancelar</button>
          <button
            onClick={() => onConfirm(user.Id, role)}
            disabled={loading}
            style={btnApprove}
          >
            {loading ? "Aprobando…" : "✓ Aprobar usuario"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Página ─────────────────────────────────────────────── */
export const UsersPage = () => {
  const { pendingUsers, loading, error, fetchPendingUsers, approveUser, clearError } = useUsersStore();
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchPendingUsers(); }, []);

  const handleApprove = async (userId, role) => {
    const result = await approveUser(userId, role);
    if (result.success) setSelected(null);
  };

  return (
    <>
      <div style={pageWrap}>
        {/* Header */}
        <div style={pageHeader}>
          <div>
            <h1 style={pageTitle}>Solicitudes pendientes</h1>
            <p style={pageSubtitle}>
              {pendingUsers.length} usuario{pendingUsers.length !== 1 ? "s" : ""} esperando aprobación
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={errorBanner}>
            <span>{error}</span>
            <button onClick={clearError} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, color: "#dc2626" }}>×</button>
          </div>
        )}

        {/* Tabla */}
        <div style={tableWrap}>
          {loading && !pendingUsers.length ? (
            <div style={emptyState}>Cargando solicitudes…</div>
          ) : pendingUsers.length === 0 ? (
            <div style={emptyState}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <div style={{ fontWeight: 600, color: "#475569" }}>Sin solicitudes pendientes</div>
              <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>Todos los usuarios han sido procesados.</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead>
                  <tr>
                    {["Nombre", "Usuario", "Correo", "DPI", "Teléfono", "Trabajo", "Ingreso", "Acciones"].map((h) => (
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user, i) => (
                    <tr
                      key={user.Id}
                      style={{ ...tr, background: i % 2 === 0 ? "#fff" : "#f8fafc" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                      onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#f8fafc"}
                    >
                      <td style={td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ ...avatar, width: 30, height: 30, fontSize: 12 }}>
                            {user.Name?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: "#0f172a" }}>{user.Name}</span>
                        </div>
                      </td>
                      <td style={td}><span style={monoChip}>@{user.Username}</span></td>
                      <td style={td}><span style={{ color: "#475569", fontSize: 13 }}>{user.Email}</span></td>
                      <td style={td}><span style={monoChip}>{user.DPI}</span></td>
                      <td style={td}><span style={{ color: "#475569", fontSize: 13 }}>{user.Phone}</span></td>
                      <td style={td}><span style={{ color: "#475569", fontSize: 13 }}>{user.Job}</span></td>
                      <td style={td}>
                        <span style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>
                          Q {Number(user.MonthlyIncome).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td style={td}>
                        <button
                          onClick={() => setSelected(user)}
                          style={btnReview}
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
  );
};

/* ─── Estilos (objetos JS) ───────────────────────────────── */
const pageWrap = {
  padding: "32px 28px",
  maxWidth: 1200,
  margin: "0 auto",
  fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
};

const pageHeader = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  marginBottom: 24,
};

const pageTitle = {
  fontSize: 22,
  fontWeight: 800,
  color: "#0f172a",
  margin: 0,
  letterSpacing: "-0.02em",
};

const pageSubtitle = {
  fontSize: 13,
  color: "#94a3b8",
  marginTop: 4,
  margin: 0,
};

const errorBanner = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 10,
  padding: "10px 16px",
  marginBottom: 16,
  fontSize: 13,
  color: "#dc2626",
};

const tableWrap = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  overflow: "hidden",
};

const emptyState = {
  padding: "64px 24px",
  textAlign: "center",
  color: "#94a3b8",
  fontSize: 14,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

const th = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 700,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  background: "#f8fafc",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
};

const tr = { transition: "background 0.1s" };

const td = {
  padding: "12px 16px",
  borderBottom: "1px solid #f1f5f9",
  verticalAlign: "middle",
};

const monoChip = {
  fontFamily: "monospace",
  fontSize: 12,
  background: "#f1f5f9",
  borderRadius: 6,
  padding: "2px 7px",
  color: "#475569",
};

const btnReview = {
  background: "#0f172a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "6px 14px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  transition: "background 0.15s",
  whiteSpace: "nowrap",
};

/* Modal styles */
const overlay = {
  position: "fixed",
  inset: 0,
  zIndex: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.35)",
  backdropFilter: "blur(4px)",
};

const card = {
  background: "#fff",
  borderRadius: 20,
  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  width: "100%",
  maxWidth: 480,
  margin: "0 16px",
  overflow: "hidden",
  fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
};

const cardHeader = {
  background: "#0f172a",
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const closeBtn = {
  background: "none",
  border: "none",
  color: "#64748b",
  fontSize: 22,
  cursor: "pointer",
  lineHeight: 1,
  padding: 0,
};

const avatar = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: 15,
  flexShrink: 0,
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px 16px",
};

const infoCell = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const infoLabel = {
  fontSize: 10,
  fontWeight: 700,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
};

const infoVal = {
  fontSize: 13,
  color: "#1e293b",
  fontWeight: 500,
};

const fieldLabel = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: 6,
};

const selectStyle = {
  width: "100%",
  border: "1.5px solid #e2e8f0",
  borderRadius: 10,
  padding: "8px 12px",
  fontSize: 13,
  color: "#1e293b",
  background: "#f8fafc",
  outline: "none",
};

const cardFooter = {
  padding: "16px 24px",
  borderTop: "1px solid #f1f5f9",
  display: "flex",
  gap: 10,
  justifyContent: "flex-end",
};

const btnSecondary = {
  background: "#f1f5f9",
  color: "#475569",
  border: "none",
  borderRadius: 10,
  padding: "8px 18px",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};

const btnApprove = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "8px 20px",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};