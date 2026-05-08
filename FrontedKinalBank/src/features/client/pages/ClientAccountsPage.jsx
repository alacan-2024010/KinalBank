import { useEffect, useState } from "react";
import { useClientStore } from "../store/clientStore.js";
 
// ── Fila de transacción dentro del panel ─────────────────────────────────────
const TxRow = ({ tx, accountId }) => {
    const isCredit =
        tx.type === "DEPOSITO" ||
        tx.type === "CREDITO"  ||
        String(tx.toAccount?._id) === String(accountId);
 
    const amount   = isCredit ? tx.amountReceived : tx.amountSent;
    const currency = isCredit
        ? (tx.toAccount?.currency   ?? tx.currencyTo)
        : (tx.fromAccount?.currency ?? tx.currencyFrom);
    const symbol   = currency === "GTQ" ? "Q" : "$";
 
    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                isCredit ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            }`}>
                {isCredit ? "↓" : "↑"}
            </div>
 
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{tx.description}</p>
                <p className="text-[11px] text-gray-400">
                    {new Date(tx.createdAt).toLocaleDateString("es-GT", {
                        day: "2-digit", month: "short", year: "numeric"
                    })}
                </p>
            </div>
 
            <div className="text-right flex-shrink-0">
                <p className={`text-sm font-bold ${isCredit ? "text-green-600" : "text-red-500"}`}>
                    {isCredit ? "+" : "-"}{symbol}{" "}
                    {Number(amount).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                </p>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    isCredit ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                }`}>
                    {tx.type}
                </span>
            </div>
        </div>
    );
};
 
// ── Panel lateral deslizante ──────────────────────────────────────────────────
const HistoryPanel = ({ account, transactions, loading, onClose }) => {
    if (!account) return null;
 
    const symbol = account.currency === "GTQ" ? "Q" : "$";
 
    const txs = transactions.filter(tx =>
        String(tx.fromAccount?._id) === String(account._id) ||
        String(tx.toAccount?._id)   === String(account._id)
    );
 
    return (
        <>
            {/* Overlay oscuro */}
            <div
                className="fixed inset-0 bg-black/40 z-40 transition-opacity"
                onClick={onClose}
            />
 
            {/* Panel */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
 
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                    <div>
                        <p className="text-[11px] text-gray-400 font-mono tracking-wider mb-0.5">
                            Nº {account.accountNumber}
                        </p>
                        <h2 className="text-base font-bold text-gray-900">
                            Historial de Transacciones
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-sm font-bold"
                    >
                        ✕
                    </button>
                </div>
 
                {/* Balance */}
                <div className="px-6 py-4 bg-slate-50 border-b border-gray-100">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">
                        Saldo actual
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {symbol}{" "}
                        {Number(account.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {account.currency} · {account.accountType ?? "Cuenta de Ahorro"}
                    </p>
                </div>
 
                {/* Lista */}
                <div className="flex-1 overflow-y-auto px-6 py-2">
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                            Cargando movimientos…
                        </div>
                    ) : txs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                            <p className="text-3xl mb-2">📋</p>
                            <p className="text-sm">Sin movimientos en esta cuenta.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider py-3">
                                {txs.length} movimiento{txs.length !== 1 ? "s" : ""}
                            </p>
                            {txs.map((tx, i) => (
                                <TxRow key={tx._id ?? i} tx={tx} accountId={account._id} />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
 
// ── Tarjeta de cuenta ─────────────────────────────────────────────────────────
const AccountCard = ({ account, onViewHistory }) => {
    const isActive = account.status === "ACTIVA";
    const symbol   = account.currency === "GTQ" ? "Q" : "$";
 
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all flex flex-col">
 
            <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xl flex-shrink-0">
                    💳
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                }`}>
                    {account.status}
                </span>
            </div>
 
            <p className="text-[11px] text-gray-400 font-mono tracking-widest mb-1">
                Nº {account.accountNumber}
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
                {symbol}{" "}
                {Number(account.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mb-5">
                {account.currency} · {account.accountType ?? "Cuenta de Ahorro"}
            </p>
 
            <div className="border-t border-gray-50 pt-4 space-y-2 mb-5">
                {account.owner && (
                    <InfoRow label="Titular"  value={account.owner} />
                )}
                {account.createdAt && (
                    <InfoRow
                        label="Apertura"
                        value={new Date(account.createdAt).toLocaleDateString("es-GT", {
                            day: "2-digit", month: "long", year: "numeric"
                        })}
                    />
                )}
            </div>
 
            {/* ── Botón Ver Historial ─────────────────────────────────────── */}
            <button
                onClick={() => onViewHistory(account)}
                className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer"
            >
                <span>📋</span> Ver historial
            </button>
        </div>
    );
};
 
const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-medium text-gray-700">{value}</span>
    </div>
);
 
// ── Página principal ──────────────────────────────────────────────────────────
export const ClientAccountsPage = () => {
    const {
        accounts, transactions, loading, error,
        fetchMyAccounts, fetchMyTransactions
    } = useClientStore();
 
    const [selectedAccount, setSelectedAccount] = useState(null);
 
    useEffect(() => {
        fetchMyAccounts();
        fetchMyTransactions(1);
    }, []);
 
    const activas   = accounts.filter(a => a.status === "ACTIVA");
    const inactivas = accounts.filter(a => a.status !== "ACTIVA");
 
    return (
        <>
            <div className="max-w-5xl mx-auto space-y-8">
 
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mis cuentas</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {accounts.length} cuenta{accounts.length !== 1 ? "s" : ""} asociada{accounts.length !== 1 ? "s" : ""} a tu perfil.
                    </p>
                </div>
 
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                        {error}
                    </div>
                )}
 
                {loading ? (
                    <div className="text-center py-16 text-gray-400">Cargando cuentas…</div>
                ) : accounts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center text-gray-400">
                        <p className="text-4xl mb-3">🏦</p>
                        <p className="text-sm">Aún no tienes cuentas asociadas.</p>
                        <p className="text-xs text-gray-300 mt-1">
                            Contacta con el banco para abrir una cuenta.
                        </p>
                    </div>
                ) : (
                    <>
                        {activas.length > 0 && (
                            <div>
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                    Cuentas activas
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {activas.map(acc => (
                                        <AccountCard
                                            key={acc._id}
                                            account={acc}
                                            onViewHistory={setSelectedAccount}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
 
                        {inactivas.length > 0 && (
                            <div>
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                    Cuentas inactivas
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {inactivas.map(acc => (
                                        <AccountCard
                                            key={acc._id}
                                            account={acc}
                                            onViewHistory={setSelectedAccount}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
 
            {/* Panel lateral con historial filtrado por cuenta */}
            {selectedAccount && (
                <HistoryPanel
                    account={selectedAccount}
                    transactions={transactions}
                    loading={loading}
                    onClose={() => setSelectedAccount(null)}
                />
            )}
        </>
    );
};