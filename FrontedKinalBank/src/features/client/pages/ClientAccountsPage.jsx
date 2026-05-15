import { useEffect, useState } from "react";
import { useClientStore } from "../store/useClientStore.js";

const CURRENCY_SYMBOLS = {
    GTQ: "Q", USD: "$", EUR: "€", GBP: "£", MXN: "MX$",
    CAD: "C$", JPY: "¥", CHF: "Fr", BRL: "R$", COP: "COL$",
};

const TYPE_META = {
    DEPOSITO:      { label: "Depósito",      pill: "bg-emerald-100 text-emerald-700", icon: "↓", line: "bg-emerald-400", amount: "text-emerald-600" },
    CREDITO:       { label: "Crédito",       pill: "bg-sky-100 text-sky-700",         icon: "↓", line: "bg-sky-400",     amount: "text-sky-600" },
    RETIRO:        { label: "Retiro",        pill: "bg-rose-100 text-rose-700",       icon: "↑", line: "bg-rose-400",    amount: "text-rose-600" },
    TRANSFERENCIA: { label: "Transferencia", pill: "bg-violet-100 text-violet-700",   icon: "⇄", line: "bg-violet-400",  amount: "text-violet-600" },
    DEBITO:        { label: "Débito",        pill: "bg-orange-100 text-orange-700",   icon: "↑", line: "bg-orange-400",  amount: "text-orange-600" },
};

const getMeta = (type, isCredit) =>
    TYPE_META[type] ?? (isCredit
        ? { label: type, pill: "bg-emerald-100 text-emerald-700", icon: "↓", line: "bg-emerald-400", amount: "text-emerald-600" }
        : { label: type, pill: "bg-rose-100 text-rose-700",       icon: "↑", line: "bg-rose-400",    amount: "text-rose-600" });

/* ─── Fila de transacción ─────────────────────────────────────────────── */
const TxRow = ({ tx, accountId }) => {
    const isCredit =
        tx.type === "DEPOSITO" || tx.type === "CREDITO" ||
        String(tx.toAccount?._id) === String(accountId);

    const amount   = Number(isCredit ? tx.amountReceived : tx.amountSent) || 0;
    const currency = isCredit ? (tx.toAccount?.currency ?? tx.currencyTo) : (tx.fromAccount?.currency ?? tx.currencyFrom);
    const symbol   = CURRENCY_SYMBOLS[currency] ?? "Q";
    const meta     = getMeta(tx.type, isCredit);

    const d     = new Date(tx.createdAt);
    const day   = d.toLocaleDateString("es-GT", { day: "2-digit" });
    const month = d.toLocaleDateString("es-GT", { month: "short" }).replace(".", "").toUpperCase();

    return (
        <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group">
            <div className="w-10 flex-shrink-0 text-center">
                <p className="text-lg font-black text-slate-800 leading-none">{day}</p>
                <p className="text-[8px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">{month}</p>
            </div>
            <div className={`w-0.5 h-10 flex-shrink-0 rounded-full ${meta.line}`} />
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${isCredit ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>
                {meta.icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">{tx.description ?? tx.type}</p>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.pill}`}>
                    {meta.label}
                </span>
            </div>
            <p className={`text-sm font-black tabular-nums flex-shrink-0 ${isCredit ? "text-emerald-600" : "text-rose-500"}`}>
                {isCredit ? "+" : "−"}{symbol} {amount.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
            </p>
        </div>
    );
};

/* ─── Fila de depósito ────────────────────────────────────────────────── */
const DepositRow = ({ deposit, currency }) => {
    const symbol = CURRENCY_SYMBOLS[currency] ?? "Q";
    const amount = Number(deposit.amount) || 0;
    const isRevertido = deposit.estado === "REVERTIDO";

    const d     = new Date(deposit.fecha ?? deposit.createdAt);
    const day   = d.toLocaleDateString("es-GT", { day: "2-digit" });
    const month = d.toLocaleDateString("es-GT", { month: "short" }).replace(".", "").toUpperCase();

    return (
        <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
            <div className="w-10 flex-shrink-0 text-center">
                <p className="text-lg font-black text-slate-800 leading-none">{day}</p>
                <p className="text-[8px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">{month}</p>
            </div>
            <div className={`w-0.5 h-10 flex-shrink-0 rounded-full ${isRevertido ? "bg-rose-300" : "bg-emerald-400"}`} />
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${isRevertido ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-700"}`}>
                {isRevertido ? "↩" : "↓"}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">Depósito bancario</p>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isRevertido ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {isRevertido ? "Revertido" : "Completado"}
                </span>
            </div>
            <p className={`text-sm font-black tabular-nums flex-shrink-0 ${isRevertido ? "text-rose-400 line-through" : "text-emerald-600"}`}>
                +{symbol} {amount.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
            </p>
        </div>
    );
};

/* ─── Panel lateral ───────────────────────────────────────────────────── */
const HistoryPanel = ({ account, transactions, deposits, loading, onClose, onLoadDeposits }) => {
    const [activeTab, setActiveTab] = useState("transacciones");

    useEffect(() => {
        if (account && activeTab === "depositos") {
            onLoadDeposits(account._id);
        }
    }, [activeTab, account]);

    if (!account) return null;

    const symbol = CURRENCY_SYMBOLS[account.currency] ?? "Q";

    const txs = transactions.filter(tx =>
        String(tx.fromAccount?._id) === String(account._id) ||
        String(tx.toAccount?._id)   === String(account._id)
    );

    const deps = deposits.filter(d => String(d.accountId) === String(account._id));

    // Estadísticas: suma transacciones + depósitos completados
    const totalCreditos = txs
        .filter(tx => tx.type === "CREDITO" || String(tx.toAccount?._id) === String(account._id))
        .reduce((s, tx) => s + (Number(tx.amountReceived) || Number(tx.amount) || 0), 0)
        + deps
        .filter(d => d.estado === "COMPLETADO")
        .reduce((s, d) => s + (Number(d.amount) || 0), 0);

    const totalDebitos = txs
        .filter(tx => tx.type !== "CREDITO" && String(tx.toAccount?._id) !== String(account._id))
        .reduce((s, tx) => s + (Number(tx.amountSent) || Number(tx.amount) || 0), 0);

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40" onClick={onClose} />

            <div className="fixed top-0 right-0 h-full w-full max-w-[440px] bg-white z-50 flex flex-col shadow-2xl">

                {/* Header */}
                <div className="relative overflow-hidden bg-slate-900 px-7 py-6 flex items-start justify-between">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent pointer-events-none" />
                    <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-blue-500/10 pointer-events-none" />
                    <div className="absolute -bottom-8 right-8 w-24 h-24 rounded-full bg-indigo-500/10 pointer-events-none" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-6 bg-blue-400 rounded-full" />
                            <p className="text-[9px] font-black tracking-[0.25em] text-blue-400 uppercase">Historial de cuenta</p>
                        </div>
                        <h2 className="text-xl font-black text-white leading-tight">Movimientos</h2>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">Nº {account.accountNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="relative w-8 h-8 rounded-xl bg-white/10 border border-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all text-xs font-bold flex items-center justify-center cursor-pointer"
                    >✕</button>
                </div>

                {/* Balance */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-5 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black tracking-[0.2em] text-blue-200/70 uppercase mb-1">Saldo actual</p>
                        <p className="text-2xl font-black text-white tabular-nums">
                            {symbol} {Number(account.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-blue-200/60">{account.currency}</p>
                        <p className="text-sm font-black text-white">{account.accountType ?? "Ahorro"}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50">
                    <div className="px-6 py-4 border-r border-slate-100">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <p className="text-[8px] font-black tracking-widest text-slate-400 uppercase">Entradas</p>
                        </div>
                        <p className="text-base font-black text-emerald-600 tabular-nums">
                            +{symbol} {totalCreditos.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="px-6 py-4">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-400" />
                            <p className="text-[8px] font-black tracking-widest text-slate-400 uppercase">Salidas</p>
                        </div>
                        <p className="text-base font-black text-rose-500 tabular-nums">
                            −{symbol} {totalDebitos.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 bg-white">
                    <button
                        onClick={() => setActiveTab("transacciones")}
                        className={`flex-1 py-3 text-[11px] font-black tracking-wide uppercase transition-all cursor-pointer ${
                            activeTab === "transacciones"
                                ? "text-blue-600 border-b-2 border-blue-500 bg-blue-50/50"
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        Transacciones
                        <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === "transacciones" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"}`}>
                            {txs.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("depositos")}
                        className={`flex-1 py-3 text-[11px] font-black tracking-wide uppercase transition-all cursor-pointer ${
                            activeTab === "depositos"
                                ? "text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/50"
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        Depósitos
                        <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === "depositos" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                            {deps.length}
                        </span>
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto bg-white">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-3">
                            <div className="w-7 h-7 border-2 border-slate-100 border-t-blue-500 rounded-full animate-spin" />
                            <p className="text-sm text-slate-400">Cargando…</p>
                        </div>
                    ) : activeTab === "transacciones" ? (
                        txs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-56 gap-3">
                                <p className="text-7xl font-black text-slate-100">0</p>
                                <p className="text-sm font-bold text-slate-400">Sin transacciones</p>
                            </div>
                        ) : (
                            <>
                                <div className="px-6 pt-4 pb-2 flex items-center gap-2">
                                    <div className="w-4 h-0.5 bg-blue-400 rounded-full" />
                                    <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                        {txs.length} movimiento{txs.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                                {txs.map((tx, i) => <TxRow key={tx._id ?? i} tx={tx} accountId={account._id} />)}
                            </>
                        )
                    ) : (
                        deps.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-56 gap-3">
                                <p className="text-7xl font-black text-slate-100">0</p>
                                <p className="text-sm font-bold text-slate-400">Sin depósitos</p>
                            </div>
                        ) : (
                            <>
                                <div className="px-6 pt-4 pb-2 flex items-center gap-2">
                                    <div className="w-4 h-0.5 bg-emerald-400 rounded-full" />
                                    <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                        {deps.length} depósito{deps.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                                {deps.map((d, i) => <DepositRow key={d._id ?? i} deposit={d} currency={account.currency} />)}
                            </>
                        )
                    )}
                </div>
            </div>
        </>
    );
};

/* ─── Tarjeta de cuenta ───────────────────────────────────────────────── */
const CARD_PALETTES = [
    { bg: "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900", glow: "bg-blue-500",   chip: "from-blue-400 to-blue-600",    btn: "bg-blue-500 hover:bg-blue-400 text-white",   accent: "text-blue-400",   num: "text-blue-400/10" },
    { bg: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800", glow: "bg-indigo-500", chip: "from-indigo-400 to-indigo-600", btn: "bg-indigo-500 hover:bg-indigo-400 text-white", accent: "text-indigo-400", num: "text-indigo-400/10" },
    { bg: "bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900",   glow: "bg-cyan-500",   chip: "from-cyan-400 to-cyan-600",     btn: "bg-cyan-500 hover:bg-cyan-400 text-slate-900", accent: "text-cyan-400",   num: "text-cyan-400/10" },
    { bg: "bg-gradient-to-br from-slate-800 via-violet-950 to-slate-900", glow: "bg-violet-500", chip: "from-violet-400 to-violet-600", btn: "bg-violet-500 hover:bg-violet-400 text-white", accent: "text-violet-400", num: "text-violet-400/10" },
];

const AccountCard = ({ account, onViewHistory, index }) => {
    const isActive = account.status === "ACTIVA";
    const symbol   = CURRENCY_SYMBOLS[account.currency] ?? "Q";
    const pal      = CARD_PALETTES[index % CARD_PALETTES.length];
    const bal      = Number(account.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 });
    const bigNum   = bal.replace(/[^0-9]/g, "").slice(0, 4) || "0000";

    return (
        <div className={`relative rounded-3xl overflow-hidden shadow-lg ${pal.bg} flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-white/5`}>
            <span className={`absolute -right-3 top-0 text-[90px] font-black leading-none select-none pointer-events-none ${pal.num}`}>
                {bigNum}
            </span>
            <div className={`h-0.5 w-full bg-gradient-to-r ${pal.chip}`} />
            <div className="relative p-6 flex flex-col gap-5 flex-1">
                <div className="flex items-center justify-between">
                    <div className={`w-9 h-6 rounded-md bg-gradient-to-br ${pal.chip} shadow-lg opacity-90 flex items-center justify-center`}>
                        <div className="w-5 h-3.5 rounded-sm bg-white/20" />
                    </div>
                    <span className={`flex items-center gap-1.5 text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full ${
                        isActive
                            ? "bg-white/10 text-white border border-white/15"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white animate-pulse" : "bg-rose-300"}`} />
                        {account.status}
                    </span>
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-bold tracking-[0.18em] text-white/30 uppercase mb-2">Nº {account.accountNumber}</p>
                    <p className="text-[30px] font-black text-white leading-none tabular-nums tracking-tight">
                        {symbol} {bal}
                    </p>
                    <p className={`text-xs font-bold mt-2 ${pal.accent}`}>{account.currency} · {account.accountType ?? "Ahorro"}</p>
                </div>
                <div className="h-px bg-white/8" />
                <div className="flex items-end justify-between gap-3">
                    <div className="space-y-1.5">
                        {account.createdAt && (
                            <div>
                                <p className="text-[8px] text-white/25 uppercase tracking-widest">Apertura</p>
                                <p className="text-xs font-semibold text-white/55">
                                    {new Date(account.createdAt).toLocaleDateString("es-GT", {
                                        day: "2-digit", month: "short", year: "numeric"
                                    })}
                                </p>
                            </div>
                        )}
                        {account.owner && (
                            <div>
                                <p className="text-[8px] text-white/25 uppercase tracking-widest">Titular</p>
                                <p className="text-xs font-semibold text-white/55">{account.owner}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => onViewHistory(account)}
                        className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-wide shadow-lg transition-all hover:scale-105 cursor-pointer ${pal.btn}`}
                    >
                        Historial →
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Página principal ────────────────────────────────────────────────── */
export const ClientAccountsPage = () => {
    const {
        accounts, transactions, deposits, loading, error,
        fetchMyAccounts, fetchMyTransactions, fetchMyDeposits
    } = useClientStore();

    const [selectedAccount, setSelectedAccount] = useState(null);

    useEffect(() => {
        fetchMyAccounts();
        fetchMyTransactions(1);
    }, []);

    const activas      = accounts.filter(a => a.status === "ACTIVA");
    const inactivas    = accounts.filter(a => a.status !== "ACTIVA");
    const totalBalance = activas.reduce((s, a) => s + Number(a.balance), 0);
    const totalStr     = totalBalance.toLocaleString("es-GT", { minimumFractionDigits: 2 });

    return (
        <>
            <div className="relative max-w-5xl mx-auto pb-20 space-y-8">

                {/* Hero header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-white/5 shadow-xl p-8">
                    <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-blue-500/10 pointer-events-none" />
                    <div className="absolute -bottom-10 right-32 w-32 h-32 rounded-full bg-indigo-500/10 pointer-events-none" />
                    <span className="absolute right-0 top-0 text-[110px] font-black text-white/[0.04] leading-none select-none pointer-events-none tracking-tighter whitespace-nowrap pr-6">
                        Q {totalStr}
                    </span>
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 via-indigo-400 to-blue-600 rounded-r-full" />
                    <div className="relative flex items-end justify-between gap-6 flex-wrap">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-6 h-0.5 bg-blue-400 rounded-full" />
                                <p className="text-[9px] font-black tracking-[0.3em] text-blue-400 uppercase">KinalBank</p>
                            </div>
                            <h1 className="text-5xl font-black text-white leading-none tracking-tighter mb-3">
                                Mis<br />Cuentas
                            </h1>
                            <p className="text-slate-300 text-sm text-[15px]">
                                {accounts.length} cuenta{accounts.length !== 1 ? "s" : ""} · {activas.length} activa{activas.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                        {accounts.length > 0 && (
                            <div className="bg-white/8 backdrop-blur-sm rounded-2xl px-7 py-5 border border-white/10 min-w-[200px] flex-shrink-0">
                                <p className="text-[10px] font-black tracking-[0.25em] text-blue-300/70 uppercase mb-2">Balance total</p>
                                <p className="text-3xl font-black text-white tabular-nums tracking-tight">
                                    Q {totalStr}
                                </p>
                                <p className="text-[12px] text-slate-400 mt-1">Cuentas activas</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stat cards */}
                {accounts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Total cuentas",    value: accounts.length,  sub: `${activas.length} activa${activas.length !== 1 ? "s" : ""}`, icon: "🏦", bar: "from-blue-500 to-indigo-600",   bg: "bg-blue-50",    text: "text-blue-700" },
                            { label: "Cuentas activas",  value: activas.length,   sub: "En operación",  icon: "✓", bar: "from-emerald-500 to-green-600",  bg: "bg-emerald-50", text: "text-emerald-700" },
                            { label: "Inactivas",        value: inactivas.length, sub: "Suspendidas",   icon: "○", bar: "from-rose-500 to-red-600",       bg: "bg-rose-50",    text: "text-rose-700" },
                        ].map((s, i) => (
                            <div key={i} className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${s.bar}`} />
                                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${s.bg}`} />
                                <div className="relative flex items-start justify-between mb-6 pt-2">
                                    <p className="text-[11px] font-black tracking-[0.25em] text-slate-400 uppercase">{s.label}</p>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${s.bg} ${s.text}`}>{s.icon}</div>
                                </div>
                                <div className="relative">
                                    <h2 className={`text-6xl font-black leading-none ${s.text}`}>{s.value}</h2>
                                    <p className="text-sm text-slate-500 mt-4 font-medium">{s.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="bg-rose-50 border-l-4 border-rose-400 text-rose-700 text-sm px-5 py-4 rounded-xl flex items-center gap-3">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-28 gap-4">
                        <div className="w-10 h-10 border-[3px] border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-sm font-semibold text-slate-400 tracking-wide">Cargando cuentas…</p>
                    </div>
                ) : accounts.length === 0 ? (
                    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-20 text-center">
                        <p className="text-7xl font-black text-slate-200 mb-4">0</p>
                        <p className="text-sm font-bold text-slate-500">Aún no tienes cuentas asociadas</p>
                        <p className="text-xs text-slate-400 mt-1">Contacta con el banco para abrir una.</p>
                    </div>
                ) : (
                    <>
                        {activas.length > 0 && (
                            <section className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                                        <p className="text-[10px] font-black tracking-[0.25em] text-slate-500 uppercase">Cuentas Activas</p>
                                    </div>
                                    <div className="flex-1 h-px bg-slate-200" />
                                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">{activas.length}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {activas.map((acc, i) => (
                                        <AccountCard key={acc._id} account={acc} onViewHistory={setSelectedAccount} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {inactivas.length > 0 && (
                            <section className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                                        <p className="text-[10px] font-black tracking-[0.25em] text-slate-500 uppercase">Cuentas Inactivas</p>
                                    </div>
                                    <div className="flex-1 h-px bg-slate-200" />
                                    <span className="text-[10px] font-black text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">{inactivas.length}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-60">
                                    {inactivas.map((acc, i) => (
                                        <AccountCard key={acc._id} account={acc} onViewHistory={setSelectedAccount} index={activas.length + i} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>

            {selectedAccount && (
                <HistoryPanel
                    account={selectedAccount}
                    transactions={transactions}
                    deposits={deposits}
                    loading={loading}
                    onClose={() => setSelectedAccount(null)}
                    onLoadDeposits={fetchMyDeposits}
                />
            )}
        </>
    );
};