import { useEffect, useState } from "react";
import { useClientStore } from "../store/useClientStore.js";

const CURRENCY_SYMBOLS = {
    GTQ: "Q", USD: "$", EUR: "€", GBP: "£", MXN: "MX$",
    CAD: "C$", JPY: "¥", CHF: "Fr", BRL: "R$", COP: "COL$",
};

const TYPE_META = {
    DEPOSITO:      { label: "Depósito",      bg: "bg-emerald-100", text: "text-emerald-700", icon: "↓", dot: "bg-emerald-500" },
    TRANSFERENCIA: { label: "Transferencia", bg: "bg-violet-100",  text: "text-violet-700",  icon: "⇄", dot: "bg-violet-500" },
    COMPRA:        { label: "Compra",        bg: "bg-orange-100",  text: "text-orange-700",  icon: "🛍", dot: "bg-orange-500" },
    CREDITO:       { label: "Crédito",       bg: "bg-sky-100",     text: "text-sky-700",     icon: "↓", dot: "bg-sky-500"     },
};

const getMeta = (type, isCredit) =>
    TYPE_META[type] ?? (isCredit
        ? { label: type, bg: "bg-emerald-100", text: "text-emerald-700", icon: "↓", dot: "bg-emerald-500" }
        : { label: type, bg: "bg-rose-100",    text: "text-rose-700",    icon: "↑", dot: "bg-rose-500" });

const formatDate = (iso) => {
    const d = new Date(iso);
    return {
        day:   d.toLocaleDateString("es-GT", { day: "2-digit" }),
        month: d.toLocaleDateString("es-GT", { month: "short" }).replace(".", "").toUpperCase(),
        time:  d.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" }),
    };
};

const TxRow = ({ tx }) => {
    const isCredit = tx.type === "DEPOSITO" || tx.type === "CREDITO";
    const symbol   = CURRENCY_SYMBOLS[isCredit ? tx.currencyTo : tx.currencyFrom] ?? "Q";
    const amount   = Number(isCredit ? tx.amountReceived : tx.amountSent) || 0;
    const meta     = getMeta(tx.type, isCredit);
    const date     = formatDate(tx.createdAt);

    return (
        <div className="grid grid-cols-[56px_1fr_auto] gap-4 items-center px-6 py-4 border-b border-slate-100 hover:bg-slate-50 transition-all duration-150">
            <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold tracking-widest text-slate-400">{date.month}</span>
                <span className="text-lg font-black text-slate-700 leading-none">{date.day}</span>
            </div>

            <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${meta.bg} ${meta.text}`}>
                    {meta.icon}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{tx.description ?? tx.type}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                            {meta.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">#{tx._id?.slice(-8)}</span>
                    </div>
                </div>
            </div>

            <div className="text-right">
                <p className={`text-base font-black tabular-nums ${isCredit ? "text-emerald-600" : "text-rose-500"}`}>
                    {isCredit ? "+" : "−"}{symbol} {amount.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{date.time}</p>
            </div>
        </div>
    );
};

const FILTERS = [
    { key: "TODOS",         label: "Todos" },
    { key: "DEPOSITO",      label: "Depósito" },
    { key: "TRANSFERENCIA", label: "Transferencia" },
    { key: "COMPRA",        label: "Compra" },
    { key: "CREDITO",       label: "Crédito" },
];

export const ClientTransactionsPage = () => {
    const { transactions, pagination, loading, error, fetchMyTransactions } = useClientStore();
    const [filter, setFilter] = useState("TODOS");

    useEffect(() => { fetchMyTransactions(1); }, []);

    const changePage = (p) => {
        if (p < 1 || p > pagination.totalPages) return;
        fetchMyTransactions(p);
    };

    const filtered = filter === "TODOS"
        ? transactions
        : transactions.filter(tx => tx.type === filter);

    const totalCreditos = transactions
        .filter(tx => tx.type === "DEPOSITO" || tx.type === "CREDITO")
        .reduce((s, tx) => s + Number(tx.amountReceived ?? 0), 0);

    const totalDebitos = transactions
        .filter(tx => tx.type === "TRANSFERENCIA" || tx.type === "COMPRA")
        .reduce((s, tx) => s + Number(tx.amountSent ?? 0), 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">

            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-1">KinalBank</p>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Movimientos</h1>
                    <p className="text-sm text-slate-500 mt-1">Historial completo de tus transacciones</p>
                </div>
                <span className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    {pagination.totalRecords ?? transactions.length} registros
                </span>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">

                {/* Total */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-slate-400 to-slate-600" />
                    <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Total movimientos</p>
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-base">📊</div>
                        </div>
                        <p className="text-2xl font-black text-slate-900 tabular-nums">{transactions.length}</p>
                        <p className="text-[11px] text-slate-400 mt-1.5">
                            Página {pagination.currentPage ?? 1} de {pagination.totalPages ?? 1}
                        </p>
                    </div>
                </div>

                {/* Entradas */}
                <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />
                    <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase">Entradas</p>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-sm font-black text-emerald-600">↓</div>
                        </div>
                        <p className="text-2xl font-black text-emerald-700 tabular-nums">
                            Q {totalCreditos.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[11px] text-emerald-400 mt-1.5">Depósitos y créditos</p>
                    </div>
                </div>

                {/* Salidas */}
                <div className="bg-white rounded-2xl border border-rose-200 shadow-sm overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-rose-400 to-pink-500" />
                    <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[10px] font-bold tracking-widest text-rose-600 uppercase">Salidas</p>
                            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-sm font-black text-rose-500">↑</div>
                        </div>
                        <p className="text-2xl font-black text-rose-600 tabular-nums">
                            Q {totalDebitos.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[11px] text-rose-400 mt-1.5">Transferencias y compras</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-5 py-4 flex items-center gap-3">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* Tabla */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Header oscuro con filtros */}
                <div className="bg-slate-900 px-6 py-4 flex items-center gap-2 flex-wrap">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-base mr-1">📋</div>
                    <p className="text-white font-bold text-sm mr-3">Transacciones</p>
                    <div className="flex items-center gap-1 flex-wrap flex-1">
                        {FILTERS.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                                    filter === f.key
                                        ? "bg-white text-slate-900"
                                        : "text-white/50 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <span className="text-[10px] text-white/30 font-mono ml-auto">
                        {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Columnas */}
                <div className="grid grid-cols-[56px_1fr_auto] gap-4 px-6 py-2.5 border-b border-slate-100 bg-slate-50">
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Fecha</p>
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Descripción</p>
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase text-right">Monto</p>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
                        <p className="text-sm text-slate-400">Cargando movimientos…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">📋</div>
                        <p className="text-sm font-semibold text-slate-500">Sin movimientos registrados</p>
                        <p className="text-xs text-slate-400">Las transacciones aparecerán aquí</p>
                    </div>
                ) : (
                    filtered.map((tx, i) => <TxRow key={tx._id ?? i} tx={tx} />)
                )}
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-mono">
                        Página <span className="text-slate-700 font-bold">{pagination.currentPage}</span> de {pagination.totalPages}
                        {" · "}{pagination.totalRecords} registros
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => changePage(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                        >
                            ← Anterior
                        </button>
                        <button
                            onClick={() => changePage(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                        >
                            Siguiente →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};