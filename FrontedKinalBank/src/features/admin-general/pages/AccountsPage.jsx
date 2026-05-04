import { useEffect, useState } from "react"
import { useAccountsStore } from "../store/accountStore.js"
import { AccountModal } from "../components/AccountModal.jsx"
import { ConfirmModal } from "../components/ConfirmModal.jsx"

const statusColors = {
    ACTIVE:   { bg: "#dcfce7", color: "#15803d" },
    INACTIVE: { bg: "#fee2e2", color: "#dc2626" },
    FROZEN:   { bg: "#dbeafe", color: "#1d4ed8" },
}

const Badge = ({ value }) => {
    const s = statusColors[value] || { bg: "#f1f5f9", color: "#475569" }
    return (
        <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
            background: s.bg, color: s.color, letterSpacing: "0.04em",
        }}>{value}</span>
    )
}

export const AccountsPage = () => {
    const { accounts = [], pagination, loading, error, fetchAccounts, addAccount, editAccount, removeAccount, clearError } = useAccountsStore()
    const [modal, setModal] = useState({ type: null, account: null })

    useEffect(() => { fetchAccounts() }, [])

    const handleCreate = async (form) => {
        const result = await addAccount(form)
        if (result.success) setModal({ type: null, account: null })
        return result
    }
    const handleEdit = async (form) => {
        const result = await editAccount(modal.account._id, form)
        if (result.success) setModal({ type: null, account: null })
        return result
    }
    const handleDelete = async () => {
        const result = await removeAccount(modal.account._id)
        if (result.success) setModal({ type: null, account: null })
    }
    const changePage = (p) => {
        if (p < 1 || p > pagination.totalPages) return
        fetchAccounts(p)
    }

    return (
        <>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <div>
                        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>Cuentas bancarias</h1>
                        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>{pagination?.totalRecords || 0} cuentas registradas</p>
                    </div>
                    <button onClick={() => setModal({ type: "create" })} style={{
                        padding: "9px 18px", borderRadius: 8, border: "none",
                        background: "#0f172a", color: "#fff", fontSize: 13,
                        fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                    }}>
                        + Nueva cuenta
                    </button>
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
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                    {["N° cuenta", "Tipo", "Moneda", "Saldo", "Estado", "Propietario", "Acciones"].map(h => (
                                        <th key={h} style={{
                                            padding: "12px 16px", textAlign: "left", fontSize: 10,
                                            fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8",
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading && !accounts.length ? (
                                    <tr><td colSpan={7} style={{ padding: "60px 20px", textAlign: "center", color: "#94a3b8" }}>Cargando…</td></tr>
                                ) : accounts.length === 0 ? (
                                    <tr><td colSpan={7} style={{ padding: "60px 20px", textAlign: "center", color: "#94a3b8" }}>No hay cuentas aún.</td></tr>
                                ) : accounts.map((acc, i) => (
                                    <tr key={acc._id} style={{
                                        borderBottom: "1px solid #f1f5f9",
                                        background: i % 2 === 0 ? "#fff" : "#fafafa", transition: "background 150ms",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa"}
                                    >
                                        <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "#475569", fontSize: 12 }}>{acc.accountNumber}</td>
                                        <td style={{ padding: "12px 16px" }}><Badge value={acc.accountType} /></td>
                                        <td style={{ padding: "12px 16px" }}><Badge value={acc.currency} /></td>
                                        <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0f172a" }}>
                                            {acc.balance.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                                        </td>
                                        <td style={{ padding: "12px 16px" }}><Badge value={acc.status} /></td>
                                        <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: "#94a3b8", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{acc.ownerId}</td>
                                        <td style={{ padding: "12px 16px" }}>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button onClick={() => setModal({ type: "edit", account: acc })} style={{
                                                    background: "none", border: "none", fontSize: 12, fontWeight: 600,
                                                    color: "#4f46e5", cursor: "pointer", padding: 0,
                                                }}>Editar</button>
                                                <span style={{ color: "#e2e8f0" }}>|</span>
                                                <button onClick={() => setModal({ type: "delete", account: acc })} style={{
                                                    background: "none", border: "none", fontSize: 12, fontWeight: 600,
                                                    color: "#dc2626", cursor: "pointer", padding: 0,
                                                }}>Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {pagination?.totalPages > 1 && (
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "12px 16px", borderTop: "1px solid #f1f5f9", background: "#f8fafc",
                        }}>
                            <span style={{ fontSize: 12, color: "#94a3b8" }}>
                                Página {pagination?.currentPage} de {pagination?.totalPages}
                            </span>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => changePage(Number(pagination?.currentPage) - 1)}
                                    disabled={pagination?.currentPage <= 1}
                                    style={{
                                        padding: "6px 14px", borderRadius: 6, border: "1px solid #e2e8f0",
                                        background: "#fff", fontSize: 12, cursor: "pointer", color: "#475569",
                                        opacity: pagination?.currentPage <= 1 ? 0.4 : 1,
                                    }}>← Anterior</button>
                                <button onClick={() => changePage(Number(pagination?.currentPage) + 1)}
                                    disabled={pagination?.currentPage >= pagination?.totalPages}
                                    style={{
                                        padding: "6px 14px", borderRadius: 6, border: "1px solid #e2e8f0",
                                        background: "#fff", fontSize: 12, cursor: "pointer", color: "#475569",
                                        opacity: pagination?.currentPage >= pagination?.totalPages ? 0.4 : 1,
                                    }}>Siguiente →</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {modal?.type === "create" && <AccountModal onClose={() => setModal({ type: null, account: null })} onSave={handleCreate} loading={loading} />}
            {modal?.type === "edit" && <AccountModal initial={modal.account} onClose={() => setModal({ type: null, account: null })} onSave={handleEdit} loading={loading} />}
            {modal?.type === "delete" && <ConfirmModal account={modal.account} onClose={() => setModal({ type: null, account: null })} onConfirm={handleDelete} loading={loading} />}
        </>
    )
}