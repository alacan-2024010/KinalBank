import { useEffect, useState } from "react";
import { useUsersStore } from "../store/UserStore";
import { ApproveModal } from "../components/ApproveModal";

export const UsersPage = () => {
  const { pendingUsers = [], loading, error, getPendingUsers, approveUser, clearError } = useUsersStore();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getPendingUsers();
  }, []);

  const handleApprove = async (userId, role) => {
    const result = await approveUser(userId, role);
    if (result?.success) setSelected(null);
  };

  return (
    <>
      <div style={pageWrap}>
        <div style={pageHeader}>
          <div>
            <h1 style={pageTitle}>Solicitudes pendientes</h1>
            <p style={pageSubtitle}>
              {pendingUsers.length} usuario{pendingUsers.length !== 1 ? "s" : ""} esperando aprobación
            </p>
          </div>
        </div>

        {error && (
          <div style={errorBanner}>
            <span>{error}</span>
            <button onClick={clearError} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, color: "#dc2626" }}>×</button>
          </div>
        )}

        <div style={tableWrap}>
          {loading && pendingUsers.length === 0 ? (
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
                      style={{ ...trStyle, background: i % 2 === 0 ? "#fff" : "#f8fafc" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                      onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#f8fafc"}
                    >
                      <td style={td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={tdAvatar}>{user.Name?.charAt(0).toUpperCase()}</div>
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
                          Q {Number(user.MonthlyIncome || 0).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td style={td}>
                        <button onClick={() => setSelected(user)} style={btnReview}>Revisar →</button>
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

// ── Estilos ──────────────────────────────────────────────
const pageWrap = { padding: "32px 36px", maxWidth: 1100, margin: "0 auto" };
const pageHeader = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 };
const pageTitle = { fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 };
const pageSubtitle = { fontSize: 13, color: "#94a3b8", margin: "4px 0 0" };
const errorBanner = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626",
  borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13,
};
const tableWrap = {
  background: "#fff", borderRadius: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #f1f5f9", overflow: "hidden",
};
const emptyState = { padding: "60px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 };
const table = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const th = {
  padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700,
  letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8",
  background: "#f8fafc", borderBottom: "1px solid #f1f5f9",
};
const trStyle = { borderBottom: "1px solid #f8fafc", transition: "background 150ms" };
const td = { padding: "12px 16px", verticalAlign: "middle" };
const tdAvatar = {
  width: 30, height: 30, borderRadius: "50%", background: "#e0e7ff",
  color: "#4f46e5", fontWeight: 700, fontSize: 12,
  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
};
const monoChip = {
  fontFamily: "monospace", fontSize: 12, background: "#f1f5f9",
  color: "#475569", padding: "2px 8px", borderRadius: 4,
};
const btnReview = {
  padding: "6px 14px", borderRadius: 6, border: "1px solid #e2e8f0",
  background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
  color: "#4f46e5", transition: "background 150ms",
};