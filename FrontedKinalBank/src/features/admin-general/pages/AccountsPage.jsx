import { useEffect, useState } from "react";
import { useAccountsStore } from "../store/accountStore.js";
import { AccountModal } from "../components/AccountModal.jsx";
import { ConfirmModal } from "../components/ConfirmModal.jsx";
import { Badge } from "../components/Badge.jsx";

const StatCard = ({ label, value, sub, icon, color }) => (
    <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/30 px-5 py-4">

        {/* Glow */}
        <div className={`absolute top-[-20px] right-[-20px] w-20 h-20 rounded-full blur-3xl opacity-10 ${color}`} />

        <div className="relative z-10 flex items-center justify-between gap-4">

            {/* Text */}
            <div className="min-w-0 flex-1">

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-2">
                    {label}
                </p>

                <h3 className="text-[2rem] leading-none font-black text-slate-800 whitespace-nowrap">
                    {value}
                </h3>

                {sub && (
                    <p className="text-[11px] text-slate-400 mt-2 truncate">
                        {sub}
                    </p>
                )}

            </div>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner flex-shrink-0">
                {icon}
            </div>

        </div>
    </div>
);

export const AccountsPage = () => {

    const {
        accounts = [],
        pagination,
        loading,
        error,
        fetchAccounts,
        addAccount,
        editAccount,
        removeAccount,
        clearError,
    } = useAccountsStore();

    const [modal, setModal] = useState({ type: null, account: null });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleCreate = async (form) => {
        const result = await addAccount(form);

        if (result.success) {
            setModal({ type: null, account: null });
        }

        return result;
    };

    const handleEdit = async (form) => {
        const result = await editAccount(modal.account._id, form);

        if (result.success) {
            setModal({ type: null, account: null });
        }

        return result;
    };

    const handleDelete = async () => {
        const result = await removeAccount(modal.account._id);

        if (result.success) {
            setModal({ type: null, account: null });
        }
    };

    const changePage = (p) => {
        if (p < 1 || p > pagination.totalPages) return;
        fetchAccounts(p);
    };

    const totalGTQ = accounts
        .filter(a => a.currency === "GTQ" && a.status === "ACTIVA")
        .reduce((s, a) => s + a.balance, 0);

    const totalUSD = accounts
        .filter(a => a.currency === "USD" && a.status === "ACTIVA")
        .reduce((s, a) => s + a.balance, 0);

    const activas = accounts.filter(a => a.status === "ACTIVA").length;

    return (
        <>
            <div className="max-w-5xl mx-auto">

                {/* Error */}
                {error && (
                    <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                        <p className="text-sm font-medium text-red-600">
                            {error}
                        </p>

                        <button
                            onClick={clearError}
                            className="text-red-400 hover:text-red-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* HERO */}
                <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#071126] via-[#0d1b36] to-[#15264a] p-8 md:p-10 shadow-2xl shadow-slate-900/20 mb-8">

                    {/* Glow */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full" />
                    <div className="absolute bottom-[-120px] left-[-80px] w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                        {/* Left */}
                        <div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-5">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                                <span className="text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold">
                                    Gestión financiera
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                Cuentas
                                <span className="block bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                                    bancarias
                                </span>
                            </h1>

                            <p className="text-slate-300 mt-4 max-w-2xl leading-relaxed">
                                Administra las cuentas del sistema financiero,
                                controla balances y supervisa movimientos bancarios.
                            </p>

                        </div>

                        {/* Action */}
                        <div className="flex flex-col items-start lg:items-end gap-4">

                            <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-5 min-w-[220px]">

                                <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">
                                    Total cuentas
                                </p>

                                <h2 className="text-4xl font-black text-white">
                                    {pagination?.totalRecords || 0}
                                </h2>

                                <div className="mt-3 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                                    <span className="text-emerald-300 text-xs font-medium">
                                        Sistema actualizado
                                    </span>
                                </div>

                            </div>

                            <button
                                onClick={() => setModal({ type: "create" })}
                                disabled={loading}
                                className="group relative overflow-hidden px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all duration-300 disabled:opacity-60"
                            >

                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <span className="relative z-10 flex items-center gap-2">
                                    <span className="text-lg">
                                        +
                                    </span>

                                    Nueva cuenta
                                </span>

                            </button>

                        </div>

                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                    <StatCard
                        label="Total en GTQ"
                        value={`Q ${totalGTQ.toLocaleString("es-GT", {
                            minimumFractionDigits: 2
                        })}`}
                        sub="Balances activos en quetzales"
                        color="bg-emerald-500"
                        icon={
                            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M10 6v8M7.5 8.5C7.5 7.1 8.6 6 10 6s2.5 1.1 2.5 2.5S11.4 11 10 11H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        }
                    />

                    <StatCard
                        label="Total en USD"
                        value={`$ ${totalUSD.toLocaleString("en-US", {
                            minimumFractionDigits: 2
                        })}`}
                        sub="Balances activos en dólares"
                        color="bg-indigo-500"
                        icon={
                            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M10 5.5v9M8 8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2 .9-2 2 .9 2 2 2 2-.9 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        }
                    />

                    <StatCard
                        label="Cuentas activas"
                        value={activas}
                        sub={`${accounts.length} registradas en total`}
                        color="bg-cyan-500"
                        icon={
                            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                                <rect x="2.5" y="5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M2.5 8.5h15" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M6 12.5h2M10 12.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        }
                    />

                </div>

                {/* TABLE */}
                <div className="rounded-[30px] border border-white/50 bg-white/85 backdrop-blur-xl shadow-xl shadow-slate-200/50 overflow-hidden max-w-5xl mx-auto">

                    {/* Top */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                Lista de cuentas
                            </h2>

                            <p className="text-sm text-slate-400 mt-1">
                                Gestión general de cuentas bancarias
                            </p>
                        </div>

                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-100">
                            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />

                            <span className="text-sm font-semibold text-indigo-600">
                                {accounts.length} cuentas
                            </span>
                        </div>

                    </div>

                    {/* CONTENT */}
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[920px]">

                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70">

                                    {[
                                        "Cuenta",
                                        "Tipo",
                                        "Moneda",
                                        "Saldo",
                                        "Estado",
                                        "Propietario",
                                        "Acciones"
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400"
                                        >
                                            {h}
                                        </th>
                                    ))}

                                </tr>
                            </thead>

                            <tbody>

                                {loading && !accounts.length ? (
                                    <tr>
                                        <td colSpan={7} className="py-24">

                                            <div className="flex flex-col items-center gap-4">

                                                <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin" />

                                                <p className="text-slate-400 font-medium">
                                                    Cargando cuentas...
                                                </p>

                                            </div>

                                        </td>
                                    </tr>
                                ) : accounts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-24">

                                            <div className="flex flex-col items-center">

                                                <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center shadow-lg mb-5">
                                                    <span className="text-5xl">
                                                        🏦
                                                    </span>
                                                </div>

                                                <h3 className="text-2xl font-bold text-slate-700 mb-2">
                                                    No hay cuentas
                                                </h3>

                                                <p className="text-slate-400 text-center max-w-sm">
                                                    Crea la primera cuenta bancaria para comenzar a administrar el sistema.
                                                </p>

                                            </div>

                                        </td>
                                    </tr>
                                ) : (
                                    accounts.map((acc) => (

                                        <tr
                                            key={acc._id}
                                            className="border-b border-slate-100 hover:bg-indigo-50/30 transition-all duration-300"
                                        >

                                            {/* Cuenta */}
                                            <td className="px-4 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                                        🏦
                                                    </div>

                                                    <div>
                                                        <p className="font-bold text-slate-700 font-mono text-sm">
                                                            {acc.accountNumber}
                                                        </p>

                                                        <p className="text-xs text-slate-400 mt-1">
                                                            Cuenta bancaria
                                                        </p>
                                                    </div>

                                                </div>

                                            </td>

                                            {/* Tipo */}
                                            <td className="px-4 py-4">
                                                <Badge value={acc.accountType} />
                                            </td>

                                            {/* Moneda */}
                                            <td className="px-4 py-4">
                                                <Badge value={acc.currency} />
                                            </td>

                                            {/* Saldo */}
                                            <td className="px-4 py-4">

                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100">

                                                    <span className="text-emerald-600 font-bold">
                                                        {acc.currency === "USD" ? "$" : "Q"}{" "}
                                                        {acc.balance.toLocaleString("es-GT", {
                                                            minimumFractionDigits: 2
                                                        })}
                                                    </span>

                                                </div>

                                            </td>

                                            {/* Estado */}
                                            <td className="px-4 py-4">
                                                <Badge value={acc.status} />
                                            </td>

                                            {/* Owner */}
                                            <td className="px-4 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center">
                                                        {(acc.ownerName || acc.ownerId)?.charAt(0).toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-slate-700">
                                                            {acc.ownerName || "Propietario"}
                                                        </p>

                                                        <p className="text-xs text-slate-400">
                                                            Cliente bancario
                                                        </p>
                                                    </div>

                                                </div>

                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4">

                                                <div className="flex items-center gap-3">

                                                    <button
                                                        onClick={() => setModal({ type: "edit", account: acc })}
                                                        className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-semibold text-sm hover:bg-indigo-100 transition-colors"
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        onClick={() => setModal({ type: "delete", account: acc })}
                                                        className="px-4 py-2 rounded-xl bg-red-50 text-red-500 font-semibold text-sm hover:bg-red-100 transition-colors"
                                                    >
                                                        Eliminar
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    ))
                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* Pagination */}
                    {pagination?.totalPages > 1 && (

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/60 gap-4">

                            <p className="text-xs text-slate-400">
                                Página {pagination?.currentPage} de {pagination?.totalPages}
                            </p>

                            <div className="flex items-center gap-3">

                                <button
                                    onClick={() => changePage(Number(pagination?.currentPage) - 1)}
                                    disabled={pagination?.currentPage <= 1}
                                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-40 transition-colors"
                                >
                                    ← Anterior
                                </button>

                                <button
                                    onClick={() => changePage(Number(pagination?.currentPage) + 1)}
                                    disabled={pagination?.currentPage >= pagination?.totalPages}
                                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-40 transition-colors"
                                >
                                    Siguiente →
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

            {/* MODALS */}
            {modal?.type === "create" && (
                <AccountModal
                    onClose={() => setModal({ type: null })}
                    onSave={handleCreate}
                    loading={loading}
                />
            )}

            {modal?.type === "edit" && (
                <AccountModal
                    initial={modal.account}
                    onClose={() => setModal({ type: null })}
                    onSave={handleEdit}
                    loading={loading}
                />
            )}

            {modal?.type === "delete" && (
                <ConfirmModal
                    account={modal.account}
                    onClose={() => setModal({ type: null })}
                    onConfirm={handleDelete}
                    loading={loading}
                />
            )}
        </>
    );
};