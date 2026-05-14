import { useEffect, useState } from "react";
import { useClientStore } from "../store/clientStore.js";

const CURRENCY_SYMBOLS = {
    GTQ: "Q", USD: "$", EUR: "€", GBP: "£", MXN: "MX$",
    CAD: "C$", JPY: "¥", CHF: "Fr", BRL: "R$", COP: "COL$",
};

const TYPE_META = {
    DEPOSITO:      { label: "Depósito",      bg: "bg-emerald-100", text: "text-emerald-700", icon: "↓", dot: "bg-emerald-500" },
    CREDITO:       { label: "Crédito",       bg: "bg-sky-100",     text: "text-sky-700",     icon: "↓", dot: "bg-sky-500" },
    RETIRO:        { label: "Retiro",        bg: "bg-rose-100",    text: "text-rose-700",    icon: "↑", dot: "bg-rose-500" },
    TRANSFERENCIA: { label: "Transferencia", bg: "bg-violet-100",  text: "text-violet-700",  icon: "⇄", dot: "bg-violet-500" },
    DEBITO:        { label: "Débito",        bg: "bg-orange-100",  text: "text-orange-700",  icon: "↑", dot: "bg-orange-500" },
};

const getMeta = (type, isCredit) =>
    TYPE_META[type] ?? (isCredit
        ? { label: type, bg: "bg-emerald-100", text: "text-emerald-700", icon: "↓", dot: "bg-emerald-500" }
        : { label: type, bg: "bg-rose-100",    text: "text-rose-700",    icon: "↑", dot: "bg-rose-500" });

// ── Fila de transacción ───────────────────────────────────────────────────────
const TxRow = ({ tx, accountId }) => {
    const isCredit =
        tx.type === "DEPOSITO" ||
        tx.type === "CREDITO"  ||
        String(tx.toAccount?._id) === String(accountId);

    const amount   = Number(isCredit ? tx.amountReceived : tx.amountSent) || 0;
    const currency = isCredit
        ? (tx.toAccount?.currency   ?? tx.currencyTo)
        : (tx.fromAccount?.currency ?? tx.currencyFrom);
    const symbol   = CURRENCY_SYMBOLS[currency] ?? "Q";
    const meta     = getMeta(tx.type, isCredit);

    const d = new Date(tx.createdAt);
    const day   = d.toLocaleDateString("es-GT", { day: "2-digit" });
    const month = d.toLocaleDateString("es-GT", { month: "short" }).replace(".", "").toUpperCase();

    return (
        <div className="grid grid-cols-[44px_1fr_auto] gap-3 items-center px-5 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-all duration-150">
            <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold tracking-widest text-slate-400">{month}</span>
                <span className="text-base font-black text-slate-700 leading-none">{day}</span>
            </div>

            <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${meta.bg} ${meta.text}`}>
                    {meta.icon}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{tx.description ?? tx.type}</p>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.text}`}>
                        <span className={`w-1 h-1 rounded-full ${meta.dot}`} />
                        {meta.label}
                    </span>
                </div>
            </div>

            <div className="text-right">
                <p className={`text-sm font-black tabular-nums ${isCredit ? "text-emerald-600" : "text-rose-500"}`}>
                    {isCredit ? "+" : "−"}{symbol} {amount.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                </p>
            </div>
        </div>
    );
};

// ── Panel lateral ─────────────────────────────────────────────────────────────
const HistoryPanel = ({ account, transactions, loading, onClose }) => {
    if (!account) return null;

    const symbol = CURRENCY_SYMBOLS[account.currency] ?? "Q";
    const txs = transactions.filter(tx =>
        String(tx.fromAccount?._id) === String(account._id) ||
        String(tx.toAccount?._id)   === String(account._id)
    );

    const totalCreditos = txs
        .filter(tx => tx.type === "DEPOSITO" || tx.type === "CREDITO" || String(tx.toAccount?._id) === String(account._id))
        .reduce((s, tx) => s + (Number(tx.amountReceived) || 0), 0);

    const totalDebitos = txs
        .filter(tx => tx.type !== "DEPOSITO" && tx.type !== "CREDITO" && String(tx.toAccount?._id) !== String(account._id))
        .reduce((s, tx) => s + (Number(tx.amountSent) || 0), 0);

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" onClick={onClose} />

            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">

                {/* Header oscuro */}
                <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-white/40 font-mono tracking-wider mb-0.5">Nº {account.accountNumber}</p>
                        <h2 className="text-base font-bold text-white">Historial de Transacciones</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors text-sm font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Balance con barra de color */}
                <div className="border-b border-slate-100 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-indigo-400 to-violet-500" />
                    <div className="px-6 py-4 bg-slate-50">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Saldo actual</p>
                        <p className="text-2xl font-black text-slate-900 tabular-nums">
                            {symbol} {Number(account.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{account.currency} · {account.accountType ?? "Ahorro"}</p>
                    </div>

                    {/* Mini stats */}
                    <div className="grid grid-cols-2 border-t border-slate-100">
                        <div className="px-6 py-3 border-r border-slate-100">
                            <p className="text-[9px] font-bold tracking-widest text-emerald-500 uppercase mb-0.5">Entradas</p>
                            <p className="text-sm font-black text-emerald-600 tabular-nums">
                                +{symbol} {totalCreditos.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="px-6 py-3">
                            <p className="text-[9px] font-bold tracking-widest text-rose-500 uppercase mb-0.5">Salidas</p>
                            <p className="text-sm font-black text-rose-500 tabular-nums">
                                −{symbol} {totalDebitos.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista */}
                <div className="flex-1 overflow-y-auto">
                    {/* Columnas */}
                    <div className="grid grid-cols-[44px_1fr_auto] gap-3 px-5 py-2.5 bg-slate-50 border-b border-slate-100">
                        <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Fecha</p>
                        <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Descripción</p>
                        <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase text-right">Monto</p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-3">
                            <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
                            <p className="text-xs text-slate-400">Cargando…</p>
                        </div>
                    ) : txs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl">📋</div>
                            <p className="text-sm font-semibold text-slate-500">Sin movimientos</p>
                            <p className="text-xs text-slate-400">en esta cuenta</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest px-5 pt-3 pb-1">
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
const CARD_GRADIENTS = [
    "from-slate-800 to-slate-900",
    "from-indigo-800 to-slate-900",
    "from-violet-800 to-slate-900",
    "from-sky-800 to-slate-900",
];

const AccountCard = ({ account, onViewHistory, index }) => {
    const isActive = account.status === "ACTIVA";
    const symbol   = CURRENCY_SYMBOLS[account.currency] ?? "Q";
    const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

    return (
        <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col border border-slate-200">

            {/* Parte superior con gradiente oscuro */}
            <div className={`bg-gradient-to-br ${gradient} p-6 flex flex-col gap-4`}>
                <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl">💳</div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        isActive
                            ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                            : "bg-rose-400/20 text-rose-300 border border-rose-400/30"
                    }`}>
                        {account.status}
                    </span>
                </div>

                <div>
                    <p className="text-[10px] text-white/40 font-mono tracking-widest mb-1">Nº {account.accountNumber}</p>
                    <p className="text-2xl font-black text-white tabular-nums">
                        {symbol} {Number(account.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">{account.currency} · {account.accountType ?? "Ahorro"}</p>
                </div>
            </div>

            {/* Parte inferior blanca */}
            <div className="bg-white p-5 flex flex-col gap-4 flex-1">
                {account.createdAt && (
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Apertura</span>
                        <span className="font-semibold text-slate-700">
                            {new Date(account.createdAt).toLocaleDateString("es-GT", {
                                day: "2-digit", month: "long", year: "numeric"
                            })}
                        </span>
                    </div>
                )}
                {account.owner && (
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Titular</span>
                        <span className="font-semibold text-slate-700">{account.owner}</span>
                    </div>
                )}

                <button
                    onClick={() => onViewHistory(account)}
                    className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold tracking-wide hover:bg-slate-700 transition-all cursor-pointer"
                >
                    📋 Ver historial
                </button>
            </div>
        </div>
    );
};

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

    const totalBalance = activas.reduce((s, a) => s + Number(a.balance), 0);

    return (
        <>
            <div className="max-w-5xl mx-auto space-y-6 pb-10">

                {/* Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-1">KinalBank</p>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mis Cuentas</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {accounts.length} cuenta{accounts.length !== 1 ? "s" : ""} asociada{accounts.length !== 1 ? "s" : ""} a tu perfil
                        </p>
                    </div>
                    <span className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        {accounts.length} cuenta{accounts.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Stat cards */}
                {accounts.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="h-1.5 bg-gradient-to-r from-slate-400 to-slate-600" />
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Total cuentas</p>
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-base">🏦</div>
                                </div>
                                <p className="text-2xl font-black text-slate-900">{accounts.length}</p>
                                <p className="text-[11px] text-slate-400 mt-1.5">{activas.length} activa{activas.length !== 1 ? "s" : ""}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm overflow-hidden col-span-2">
                            <div className="h-1.5 bg-gradient-to-r from-indigo-400 to-violet-500" />
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <p className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase">Balance total (cuentas activas)</p>
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-sm font-black text-indigo-600">Q</div>
                                </div>
                                <p className="text-2xl font-black text-indigo-700 tabular-nums">
                                    Q {totalBalance.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-[11px] text-indigo-400 mt-1.5">Suma de saldos disponibles</p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-5 py-4 flex items-center gap-3">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
                        <p className="text-sm text-slate-400">Cargando cuentas…</p>
                    </div>
                ) : accounts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl mx-auto mb-4">🏦</div>
                        <p className="text-sm font-semibold text-slate-500">Aún no tienes cuentas asociadas</p>
                        <p className="text-xs text-slate-400 mt-1">Contacta con el banco para abrir una cuenta.</p>
                    </div>
                ) : (
                    <>
                        {activas.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Cuentas activas</p>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">{activas.length}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {activas.map((acc, i) => (
                                        <AccountCard key={acc._id} account={acc} onViewHistory={setSelectedAccount} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {inactivas.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Cuentas inactivas</p>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">{inactivas.length}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {inactivas.map((acc, i) => (
                                        <AccountCard key={acc._id} account={acc} onViewHistory={setSelectedAccount} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

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