import { useEffect, useState } from "react";
import { useAccountsStore } from "../store/accountStore.js";
import { AccountModal } from "../components/AccountModal.jsx";
import { ConfirmModal } from "../components/ConfirmModal.jsx";
import { Badge } from "../components/Badge.jsx";

const StatCard = ({ label, value, sub, icon }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-600">
            {icon}
        </div>
        <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
            {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
        </div>
    </div>
);

export const AccountsPage = () => {
    const {
        accounts = [], pagination, loading, error,
        fetchAccounts, addAccount, editAccount, removeAccount, clearError,
    } = useAccountsStore();

    const [modal, setModal] = useState({ type: null, account: null });

    useEffect(() => { fetchAccounts(); }, []);

    const handleCreate = async (form) => {
        const result = await addAccount(form);
        if (result.success) setModal({ type: null, account: null });
        return result;
    };

    const handleEdit = async (form) => {
        const result = await editAccount(modal.account._id, form);
        if (result.success) setModal({ type: null, account: null });
        return result;
    };

    const handleDelete = async () => {
        const result = await removeAccount(modal.account._id);
        if (result.success) setModal({ type: null, account: null });
    };

    const changePage = (p) => {
        if (p < 1 || p > pagination.totalPages) return;
        fetchAccounts(p);
    };

    // Stats calculados del lado cliente
    const totalGTQ = accounts
        .filter(a => a.currency === "GTQ" && a.status === "ACTIVA")
        .reduce((s, a) => s + a.balance, 0);
    const totalUSD = accounts
        .filter(a => a.currency === "USD" && a.status === "ACTIVA")
        .reduce((s, a) => s + a.balance, 0);
    const activas = accounts.filter(a => a.status === "ACTIVA").length;

    return (
        <>
            <div className="w-full max-w-7xl mx-auto font-sans">

                {error && (
                    <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-red-700">
                        <span>{error}</span>
                        <button onClick={clearError} className="text-red-400 hover:text-red-600 text-base ml-4">✕</button>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Cuentas bancarias</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {pagination?.totalRecords || 0} cuentas registradas
                        </p>
                    </div>
                    <button
                        onClick={() => setModal({ type: "create" })}
                        disabled={loading}
                        className="px-5 py-2.5 md:px-6 md:py-3 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 shadow-sm"
                    >
                        + Nueva cuenta
                    </button>
                </div>

                {/* Cards resumen */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <StatCard
                        label="Total en GTQ"
                        value={`Q ${totalGTQ.toLocaleString("es-GT", { minimumFractionDigits: 2 })}`}
                        sub="Cuentas activas en quetzales"
                        icon={
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                                <path d="M10 6v8M7.5 8.5C7.5 7.1 8.6 6 10 6s2.5 1.1 2.5 2.5S11.4 11 10 11H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                            </svg>
                        }
                    />
                    <StatCard
                        label="Total en USD"
                        value={`$ ${totalUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                        sub="Cuentas activas en dólares"
                        icon={
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                                <path d="M10 5.5v9M8 8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2 .9-2 2 .9 2 2 2 2-.9 2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                            </svg>
                        }
                    />
                    <StatCard
                        label="Cuentas activas"
                        value={activas}
                        sub={`de ${accounts.length} en total`}
                        icon={
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <rect x="2.5" y="5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                                <path d="M2.5 8.5h15" stroke="currentColor" strokeWidth="1.4"/>
                                <path d="M6 12.5h2M10 12.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                            </svg>
                        }
                    />
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {["N° cuenta", "Tipo", "Moneda", "Saldo", "Estado", "Propietario", "Acciones"].map((h) => (
                                        <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading && !accounts.length ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border-[3px] border-gray-100 border-t-indigo-500 animate-spin" />
                                                <p className="text-sm text-gray-400">Cargando cuentas…</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : accounts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-gray-300">
                                                        <rect x="2" y="6" width="24" height="17" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                                        <path d="M2 11h24" stroke="currentColor" strokeWidth="1.5"/>
                                                        <path d="M7 16.5h4M16 16.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-400">No hay cuentas aún</p>
                                                <p className="text-xs text-gray-300">Crea la primera cuenta con el botón de arriba</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : accounts.map((acc) => (
                                    <tr key={acc._id} className="border-b border-gray-50 hover:bg-slate-50/60 transition-colors">
                                        <td className="px-5 py-4 font-mono text-sm text-gray-600">
                                            {acc.accountNumber}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Badge value={acc.accountType} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <Badge value={acc.currency} />
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-base text-gray-900">
                                            {acc.balance.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Badge value={acc.status} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
                                                    {(acc.ownerName || acc.ownerId)?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium truncate max-w-[140px]">
                                                    {acc.ownerName || (
                                                        <span className="font-mono text-gray-400">{acc.ownerId?.slice(0, 12)}…</span>
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setModal({ type: "edit", account: acc })}
                                                    className="text-sm font-semibold text-indigo-500 hover:text-indigo-700"
                                                >
                                                    Editar
                                                </button>
                                                <span className="text-gray-200">|</span>
                                                <button
                                                    onClick={() => setModal({ type: "delete", account: acc })}
                                                    className="text-sm font-semibold text-red-500 hover:text-red-600"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination?.totalPages > 1 && (
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 border-t border-gray-100 bg-gray-50 gap-3">
                            <span className="text-xs text-gray-400">
                                Página {pagination?.currentPage} de {pagination?.totalPages}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => changePage(Number(pagination?.currentPage) - 1)}
                                    disabled={pagination?.currentPage <= 1}
                                    className="px-4 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                                >
                                    ← Anterior
                                </button>
                                <button
                                    onClick={() => changePage(Number(pagination?.currentPage) + 1)}
                                    disabled={pagination?.currentPage >= pagination?.totalPages}
                                    className="px-4 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {modal?.type === "create" && (
                <AccountModal onClose={() => setModal({ type: null })} onSave={handleCreate} loading={loading} />
            )}
            {modal?.type === "edit" && (
                <AccountModal initial={modal.account} onClose={() => setModal({ type: null })} onSave={handleEdit} loading={loading} />
            )}
            {modal?.type === "delete" && (
                <ConfirmModal account={modal.account} onClose={() => setModal({ type: null })} onConfirm={handleDelete} loading={loading} />
            )}
        </>
    );
};
