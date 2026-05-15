import { useEffect, useState } from "react";
import { useClientStore } from "../store/useClientStore.js";
import {
    ArrowDownLeft,
    ArrowUpRight,
    CreditCard,
    Wallet,
    Landmark,
} from "lucide-react";

const CURRENCY_SYMBOLS = {
    GTQ: "Q",
    USD: "$",
    EUR: "€",
    GBP: "£",
    MXN: "MX$",
};

const TYPE_META = {
    DEPOSITO: {
        label: "Depósito",
        color: "emerald",
        icon: <ArrowDownLeft size={18} />,
    },

    TRANSFERENCIA: {
        label: "Transferencia",
        color: "violet",
        icon: <ArrowUpRight size={18} />,
    },

    COMPRA: {
        label: "Compra",
        color: "orange",
        icon: <CreditCard size={18} />,
    },

    CREDITO: {
        label: "Crédito",
        color: "sky",
        icon: <Wallet size={18} />,
    },
};

const colorMap = {
    emerald: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        amount: "text-emerald-600",
        gradient: "from-emerald-400 to-teal-500",
    },

    violet: {
        bg: "bg-violet-100",
        text: "text-violet-700",
        amount: "text-violet-600",
        gradient: "from-violet-400 to-fuchsia-500",
    },

    orange: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        amount: "text-orange-600",
        gradient: "from-orange-400 to-amber-500",
    },

    sky: {
        bg: "bg-sky-100",
        text: "text-sky-700",
        amount: "text-sky-600",
        gradient: "from-sky-400 to-cyan-500",
    },
};

const formatDate = (iso) => {
    const d = new Date(iso);

    return {
        date: d.toLocaleDateString("es-GT", {
            day: "2-digit",
            month: "short",
        }),

        time: d.toLocaleTimeString("es-GT", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
};

const FILTERS = [
    { key: "TODOS", label: "Todos" },
    { key: "DEPOSITO", label: "Depósitos" },
    { key: "TRANSFERENCIA", label: "Transferencias" },
    { key: "COMPRA", label: "Compras" },
    { key: "CREDITO", label: "Créditos" },
];

const TransactionCard = ({ tx }) => {
    const isCredit =
        tx.type === "DEPOSITO" || tx.type === "CREDITO";

    const amount = Number(
        isCredit ? tx.amountReceived : tx.amountSent
    );

    const currency =
        CURRENCY_SYMBOLS[
            isCredit ? tx.currencyTo : tx.currencyFrom
        ] ?? "Q";

    const meta = TYPE_META[tx.type];
    const colors = colorMap[meta.color];
    const date = formatDate(tx.createdAt);

    return (
        <div className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl p-5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

            <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${colors.gradient}`} />

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                    <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors.bg} ${colors.text}`}
                    >
                        {meta.icon}
                    </div>

                    <div>
                        <h3 className="text-[15px] font-bold text-slate-800">
                            {tx.description ?? meta.label}
                        </h3>

                        <div className="flex items-center gap-2 mt-1">

                            <span
                                className={`px-2 py-1 rounded-full text-[11px] font-semibold ${colors.bg} ${colors.text}`}
                            >
                                {meta.label}
                            </span>

                            <span className="text-xs text-slate-400 font-mono">
                                #{tx._id?.slice(-6)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-right">

                    <p
                        className={`text-xl font-black tabular-nums ${colors.amount}`}
                    >
                        {isCredit ? "+" : "-"}
                        {currency}
                        {amount.toLocaleString("es-GT", {
                            minimumFractionDigits: 2,
                        })}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                        {date.date} • {date.time}
                    </p>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    gradient,
    text,
}) => (
    <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-xl transition-all duration-300 p-6">

        <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${gradient}`} />

        <div className="flex items-start justify-between mb-4">

            <div>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
                    {title}
                </p>

                <h2 className={`text-3xl font-black mt-2 ${text}`}>
                    {value}
                </h2>

                <p className="text-xs text-slate-400 mt-2">
                    {subtitle}
                </p>
            </div>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${text} bg-slate-100`}>
                {icon}
            </div>
        </div>
    </div>
);

export const ClientTransactionsPage = () => {
    const {
        transactions,
        pagination,
        loading,
        error,
        fetchMyTransactions,
    } = useClientStore();

    const [filter, setFilter] = useState("TODOS");

    useEffect(() => {
        fetchMyTransactions(1);
    }, []);

    const filtered =
        filter === "TODOS"
            ? transactions
            : transactions.filter((tx) => tx.type === filter);

    const totalCreditos = transactions
        .filter(
            (tx) =>
                tx.type === "DEPOSITO" ||
                tx.type === "CREDITO"
        )
        .reduce(
            (sum, tx) =>
                sum + Number(tx.amountReceived ?? 0),
            0
        );

    const totalDebitos = transactions
        .filter(
            (tx) =>
                tx.type === "TRANSFERENCIA" ||
                tx.type === "COMPRA"
        )
        .reduce(
            (sum, tx) =>
                sum + Number(tx.amountSent ?? 0),
            0
        );

    const changePage = (page) => {
        if (
            page < 1 ||
            page > pagination.totalPages
        )
            return;

        fetchMyTransactions(page);
    };

    return (
        <div className="relative min-h-screen p-6">

            {/* Fondo */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_#dbeafe,_transparent_30%),radial-gradient(circle_at_bottom_left,_#ede9fe,_transparent_30%),linear-gradient(to_bottom_right,_#f8fafc,_#eef2ff)]" />

            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">
                            KinalBank
                        </p>

                        <h1 className="text-5xl font-black tracking-tight text-slate-900">
                            Movimientos
                        </h1>

                        <p className="text-slate-500 mt-3">
                            Historial completo de tus transacciones
                        </p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 px-5 py-3 rounded-2xl shadow-sm">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                            Registros
                        </p>

                        <p className="text-2xl font-black text-slate-800">
                            {pagination.totalRecords ??
                                transactions.length}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    <StatCard
                        title="Movimientos"
                        value={transactions.length}
                        subtitle={`Página ${pagination.currentPage ?? 1}`}
                        icon={<Landmark size={22} />}
                        gradient="from-slate-500 to-slate-700"
                        text="text-slate-700"
                    />

                    <StatCard
                        title="Entradas"
                        value={`Q ${totalCreditos.toLocaleString(
                            "es-GT",
                            {
                                minimumFractionDigits: 2,
                            }
                        )}`}
                        subtitle="Depósitos y créditos"
                        icon={<ArrowDownLeft size={22} />}
                        gradient="from-emerald-400 to-teal-500"
                        text="text-emerald-600"
                    />

                    <StatCard
                        title="Salidas"
                        value={`Q ${totalDebitos.toLocaleString(
                            "es-GT",
                            {
                                minimumFractionDigits: 2,
                            }
                        )}`}
                        subtitle="Compras y transferencias"
                        icon={<ArrowUpRight size={22} />}
                        gradient="from-rose-400 to-pink-500"
                        text="text-rose-500"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl">
                        {error}
                    </div>
                )}

                {/* Filtros */}
                <div className="flex flex-wrap gap-3">

                    {FILTERS.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                                filter === f.key
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                    : "bg-white/70 backdrop-blur-xl border border-white/40 text-slate-600 hover:bg-white"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Transactions */}
                <div className="space-y-4">

                    {loading ? (
                        <div className="py-24 flex flex-col items-center">

                            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin" />

                            <p className="mt-4 text-slate-400">
                                Cargando movimientos...
                            </p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 p-16 text-center">

                            <div className="w-20 h-20 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-3xl">
                                📄
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-slate-700">
                                Sin movimientos
                            </h3>

                            <p className="text-slate-400 mt-2">
                                Tus transacciones aparecerán aquí
                            </p>
                        </div>
                    ) : (
                        filtered.map((tx, index) => (
                            <TransactionCard
                                key={tx._id ?? index}
                                tx={tx}
                            />
                        ))
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">

                        <p className="text-sm text-slate-400">
                            Página{" "}
                            <span className="font-bold text-slate-700">
                                {pagination.currentPage}
                            </span>{" "}
                            de {pagination.totalPages}
                        </p>

                        <div className="flex gap-3">

                            <button
                                onClick={() =>
                                    changePage(
                                        pagination.currentPage - 1
                                    )
                                }
                                disabled={
                                    pagination.currentPage === 1
                                }
                                className="px-5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 text-slate-700 font-semibold hover:bg-white transition-all disabled:opacity-40 cursor-pointer"
                            >
                                ← Anterior
                            </button>

                            <button
                                onClick={() =>
                                    changePage(
                                        pagination.currentPage + 1
                                    )
                                }
                                disabled={
                                    pagination.currentPage ===
                                    pagination.totalPages
                                }
                                className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all disabled:opacity-40 cursor-pointer"
                            >
                                Siguiente →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};