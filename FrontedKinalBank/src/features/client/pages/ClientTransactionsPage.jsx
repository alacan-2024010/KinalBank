import { useEffect } from "react";
import { useClientStore } from "../store/clientStore.js";

const TxRow = ({ tx }) => {
    const isCredit = tx.type === "DEPOSITO" || tx.type === "CREDITO";
    const symbol = tx.currency === "GTQ" ? "Q" : "$";

    return (
        <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                        isCredit ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                    }`}>
                        {isCredit ? "↓" : "↑"}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">{tx.description ?? tx.type}</p>
                        <p className="text-[11px] text-gray-400 font-mono">{tx.referenceNumber ?? tx._id?.slice(-8)}</p>
                    </div>
                </div>
            </td>
            <td className="py-3.5 px-4">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isCredit ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                }`}>
                    {tx.type}
                </span>
            </td>
            <td className="py-3.5 px-4 text-right">
                <p className={`text-sm font-bold ${isCredit ? "text-green-600" : "text-red-500"}`}>
                    {isCredit ? "+" : "-"}{symbol} {Number(tx.amount).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                </p>
            </td>
            <td className="py-3.5 px-4 text-right text-xs text-gray-400">
                {new Date(tx.createdAt).toLocaleDateString("es-GT", {
                    day: "2-digit", month: "short", year: "numeric"
                })}
            </td>
        </tr>
    );
};

export const ClientTransactionsPage = () => {
    const { transactions, pagination, loading, error, fetchMyTransactions } = useClientStore();

    useEffect(() => {
        fetchMyTransactions(1);
    }, []);

    const changePage = (p) => {
        if (p < 1 || p > pagination.totalPages) return;
        fetchMyTransactions(p);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Movimientos</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Historial completo de transacciones en tus cuentas.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="text-center py-16 text-gray-400 text-sm">Cargando movimientos…</div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-3xl mb-2">📋</p>
                        <p className="text-sm">Sin movimientos registrados.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                                    Descripción
                                </th>
                                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                                    Tipo
                                </th>
                                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                                    Monto
                                </th>
                                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                                    Fecha
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, i) => (
                                <TxRow key={tx._id ?? i} tx={tx} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                        Página {pagination.currentPage} de {pagination.totalPages}
                        {" · "}{pagination.totalRecords} registros
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => changePage(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            ← Anterior
                        </button>
                        <button
                            onClick={() => changePage(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Siguiente →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};