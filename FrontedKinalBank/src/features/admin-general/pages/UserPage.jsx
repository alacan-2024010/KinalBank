// front/src/features/admin-general/pages/UsersPage.jsx
import { useEffect, useState } from "react";
import { useUsersStore } from "../store/UserStore";

/* ─── Modal Aprobar Usuario ───────────────────────────── */
const ApproveModal = ({ user, onClose, onConfirm, loading }) => {
  const [role, setRole] = useState("CLIENT");

  return (
    <div style={overlay}>
      <div style={card}>
        {/* Header */}
        <div style={cardHeader}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>
            Aprobar solicitud
          </span>
          <button onClick={onClose} style={closeBtn}>×</button>
        </div>

        {/* Body */}
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

        {/* Footer */}
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

/* ─── Página de Usuarios ──────────────────────────────── */
export const UsersPage = () => {
  const { pendingUsers = [], loading, error, fetchPendingUsers, approveUser, clearError } = useUsersStore();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId, role) => {
    const result = await approveUser(userId, role);
    if (result?.success) setSelected(null);
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

        {/* Tabla de usuarios */}
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
                      style={{ ...tr, background: i % 2 === 0 ? "#fff" : "#f8fafc" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                      onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#f8fafc"}
                    >
                      <td style={td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ ...avatar, width: 30, height: 30, fontSize: 12 }}>{user.Name?.charAt(0).toUpperCase()}</div>
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

      {/* Modal */}
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

/* ─── Estilos (copiar tal cual de tu código original) ───────────────────────── */
// pageWrap, pageHeader, pageTitle, pageSubtitle, errorBanner, tableWrap, emptyState
// table, th, tr, td, monoChip, btnReview
// overlay, card, cardHeader, closeBtn, avatar, infoGrid, infoCell, infoLabel, infoVal
// fieldLabel, selectStyle, cardFooter, btnSecondary, btnApprove
// (estos ya los tienes en tu UsersPage original, solo cópialos tal cual)