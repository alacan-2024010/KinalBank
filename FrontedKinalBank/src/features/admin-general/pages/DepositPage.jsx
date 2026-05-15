import { useEffect } from "react";
import { DepositTable } from "../components/DepositTable.jsx";
import { DepositModal } from "../components/DepositModal.jsx";
import { useDepositStore } from "../store/useDepositStore.js";

const StatCard = ({ label, value, sub, icon, color }) => (
    <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/85 backdrop-blur-xl shadow-lg shadow-slate-200/30 px-5 py-4">

        {/* Glow */}
        <div className={`absolute top-[-20px] right-[-20px] w-20 h-20 rounded-full blur-3xl opacity-10 ${color}`} />

        <div className="relative z-10 flex items-center justify-between gap-4">

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

            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner flex-shrink-0">
                {icon}
            </div>

        </div>
    </div>
);

export const DepositPage = () => {

    const { deposits, getDeposits } = useDepositStore();

    useEffect(() => {
        getDeposits();
    }, []);

    const completados = deposits.filter(
        (deposit) => deposit.estado === "COMPLETADO"
    ).length;

    const revertidos = deposits.filter(
        (deposit) => deposit.estado === "REVERTIDO"
    ).length;

    return (
        <div className="max-w-5xl mx-auto">

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
                            Gestión de
                            <span className="block bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                                depósitos
                            </span>
                        </h1>

                        <p className="text-slate-300 mt-4 max-w-2xl leading-relaxed">
                            Administra y supervisa todos los depósitos realizados
                            dentro del sistema financiero bancario.
                        </p>

                    </div>

                    {/* Action */}
                    <div className="flex flex-col items-start lg:items-end gap-4">

                        <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-5 min-w-[220px]">

                            <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">
                                Total depósitos
                            </p>

                            <h2 className="text-4xl font-black text-white">
                                {deposits.length}
                            </h2>

                            <div className="mt-3 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                                <span className="text-emerald-300 text-xs font-medium">
                                    Sistema actualizado
                                </span>
                            </div>

                        </div>

                        <DepositModal />

                    </div>

                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                <StatCard
                    label="Total depósitos"
                    value={deposits.length}
                    sub="Depósitos registrados"
                    color="bg-indigo-500"
                    icon={
                        <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M10 6v8M7 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    }
                />

                <StatCard
                    label="Completados"
                    value={completados}
                    sub="Depósitos exitosos"
                    color="bg-emerald-500"
                    icon={
                        <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M6.5 10.5l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    }
                />

                <StatCard
                    label="Revertidos"
                    value={revertidos}
                    sub="Operaciones revertidas"
                    color="bg-red-500"
                    icon={
                        <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    }
                />

            </div>

            {/* TABLE */}
            <div className="rounded-[30px] border border-white/50 bg-white/85 backdrop-blur-xl shadow-xl shadow-slate-200/50 overflow-hidden">

                {/* Top */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Historial de depósitos
                        </h2>

                        <p className="text-sm text-slate-400 mt-1">
                            Registro general de movimientos bancarios
                        </p>
                    </div>

                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                        <span className="text-sm font-semibold text-emerald-600">
                            {deposits.length} registros
                        </span>
                    </div>

                </div>

                {/* Content */}
                <div className="p-6">
                    <DepositTable deposits={deposits} />
                </div>

            </div>

        </div>
    );
};