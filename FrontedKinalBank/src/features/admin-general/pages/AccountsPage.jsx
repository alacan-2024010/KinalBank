import { useEffect, useState } from "react";
import { useAccountsStore } from "../store/accountStore.js";
import { AccountModal } from "../components/AccountModal.jsx";
import { ConfirmModal } from "../components/ConfirmModal.jsx";
import { Badge } from "../components/Badge.jsx";

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

    return (
        <>
            <div className="w-full max-w-7xl mx-auto font-sans">

                {/* Error */}
                {error && (
                    <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-red-700">
                        <span>{error}</span>
                        <button onClick={clearError} className="text-red-400 hover:text-red-600 text-base ml-4">✕</button>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Cuentas bancarias
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {pagination?.totalRecords || 0} cuentas registradas
                        </p>
                    </div>

                    <button
                        onClick={() => setModal({ type: "create" })}
                        disabled={loading}
                        className="px-5 py-2.5 md:px-6 md:py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
                    >
                        + Nueva cuenta
                    </button>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">

                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {["N° cuenta", "Tipo", "Moneda", "Saldo", "Estado", "Propietario", "Acciones"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
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
                                                <div className="w-8 h-8 rounded-full border-[3px] border-gray-100 border-t-orange-500 animate-spin" />
                                                <p className="text-sm text-gray-400">Cargando cuentas…</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : accounts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-400">
                                            No hay cuentas aún.
                                        </td>
                                    </tr>
                                ) : accounts.map((acc) => (
                                    <tr key={acc._id} className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors">

                                        <td className="px-4 py-3 font-mono text-xs text-gray-500">
                                            {acc.accountNumber}
                                        </td>

                                        <td className="px-4 py-3">
                                            <Badge value={acc.accountType} />
                                        </td>

                                        <td className="px-4 py-3">
                                            <Badge value={acc.currency} />
                                        </td>

                                        <td className="px-4 py-3 font-semibold text-gray-900">
                                            {acc.balance.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                                        </td>

                                        <td className="px-4 py-3">
                                            <Badge value={acc.status} />
                                        </td>

                                        <td className="px-4 py-3 font-mono text-xs text-gray-400 max-w-[150px] truncate">
                                            {acc.ownerId}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setModal({ type: "edit", account: acc })}
                                                    className="text-xs font-semibold text-orange-500 hover:text-orange-600"
                                                >
                                                    Editar
                                                </button>

                                                <span className="text-gray-200">|</span>

                                                <button
                                                    onClick={() => setModal({ type: "delete", account: acc })}
                                                    className="text-xs font-semibold text-red-500 hover:text-red-600"
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

                    {/* Paginación */}
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

            {/* Modales */}
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