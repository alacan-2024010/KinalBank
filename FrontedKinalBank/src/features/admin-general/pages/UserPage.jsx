import { useEffect, useState } from "react";
import { useUsersStore } from "../store/useUserStore.js";
import { ApproveModal } from "../components/ApproveModal";

export const UsersPage = () => {

    const {
        pendingUsers = [],
        loading,
        error,
        getPendingUsers,
        approveUser,
        denyUser,
        clearError,
    } = useUsersStore();

    const [selected, setSelected] = useState(null);

    useEffect(() => {
        getPendingUsers();
    }, []);

    const handleApprove = async (userId, role) => {
        const result = await approveUser(userId, role);
        if (result?.success) setSelected(null);
    };

    const handleDeny = async (userId) => {
        const result = await denyUser(userId);
        if (result?.success) setSelected(null);
    };

    return (
        <>
            <div className="max-w-6xl mx-auto">

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 flex items-center justify-between">
                        <p className="text-red-600 text-sm font-medium">
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

                {/* Header */}
                <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#071126] via-[#0f1d3a] to-[#16284f] p-8 md:p-10 shadow-2xl shadow-slate-900/20 mb-8">

                    {/* Glow */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full" />
                    <div className="absolute bottom-[-100px] left-[-80px] w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-5">
                                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                <span className="text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold">
                                    Administración bancaria
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                Solicitudes
                                <span className="block bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                                    pendientes
                                </span>
                            </h1>

                            <p className="text-slate-300 mt-4 max-w-2xl leading-relaxed">
                                Gestiona y aprueba nuevas solicitudes de usuarios
                                dentro del sistema bancario administrativo.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">

                            <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-5 min-w-[170px]">
                                <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">
                                    Pendientes
                                </p>

                                <h2 className="text-4xl font-black text-white">
                                    {pendingUsers.length}
                                </h2>

                                <div className="mt-3 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                    <span className="text-orange-300 text-xs font-medium">
                                        Esperando revisión
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-5 min-w-[170px]">
                                <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">
                                    Estado
                                </p>

                                <h2 className="text-2xl font-black text-emerald-400">
                                    Activo
                                </h2>

                                <p className="text-slate-300 text-xs mt-3">
                                    Panel funcionando correctamente
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="max-w-5xl mx-auto rounded-[28px] border border-white/50 bg-white/85 backdrop-blur-xl shadow-xl shadow-slate-200/40 overflow-hidden">

                    {/* Top */}
                    <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">

                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                Lista de solicitudes
                            </h2>

                            <p className="text-sm text-slate-400 mt-1">
                                Usuarios esperando aprobación administrativa
                            </p>
                        </div>

                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200">
                            <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />

                            <span className="text-sm font-semibold text-orange-600">
                                {pendingUsers.length} pendiente{pendingUsers.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && pendingUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-28">
                            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin mb-5" />

                            <p className="text-slate-500 font-medium">
                                Cargando solicitudes...
                            </p>
                        </div>
                    ) : pendingUsers.length === 0 ? (

                        /* Empty */
                        <div className="flex flex-col items-center justify-center py-28 px-6">

                            <div className="relative mb-6">
                                <div className="w-28 h-28 rounded-[32px] bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center shadow-lg">
                                    <span className="text-5xl">
                                        ✅
                                    </span>
                                </div>

                                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-500 border-4 border-white flex items-center justify-center text-white shadow-lg">
                                    ✓
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                Todo está al día
                            </h3>

                            <p className="text-slate-400 text-center max-w-md leading-relaxed">
                                Actualmente no existen solicitudes pendientes dentro del sistema.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[920px]">

                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/80">
                                        {["Cliente", "Usuario", "Correo", "DPI", "Teléfono", "Trabajo", "Ingreso", "Estado", "Acciones"].map((item) => (
                                            <th
                                                key={item}
                                                className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400"
                                            >
                                                {item}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>

                                    {pendingUsers.map((user) => (

                                        <tr
                                            key={user.Id}
                                            className="border-b border-slate-100 hover:bg-indigo-50/40 transition-all duration-300"
                                        >

                                            {/* Cliente */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-4">

                                                    <div className="relative">
                                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20">
                                                            {user.Name?.charAt(0).toUpperCase()}
                                                        </div>

                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
                                                    </div>

                                                    <div>
                                                        <p className="font-bold text-slate-800">
                                                            {user.Name}
                                                        </p>

                                                        <p className="text-xs text-slate-400 mt-1">
                                                            Cliente bancario
                                                        </p>
                                                    </div>

                                                </div>
                                            </td>

                                            {/* Usuario */}
                                            <td className="px-4 py-4">
                                                <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
                                                    @{user.Username}
                                                </span>
                                            </td>

                                            {/* Correo */}
                                            <td className="px-4 py-4 text-slate-500 font-medium">
                                                {user.Email}
                                            </td>

                                            {/* DPI */}
                                            <td className="px-4 py-4">
                                                <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
                                                    {user.DPI}
                                                </span>
                                            </td>

                                            {/* Tel */}
                                            <td className="px-4 py-4 text-slate-500">
                                                {user.Phone}
                                            </td>

                                            {/* Trabajo */}
                                            <td className="px-4 py-4">
                                                <span className="font-medium text-slate-600">
                                                    {user.Job}
                                                </span>
                                            </td>

                                            {/* Ingreso */}
                                            <td className="px-4 py-4">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100">
                                                    <span className="text-emerald-600 font-bold">
                                                        Q {Number(user.MonthlyIncome || 0).toLocaleString("es-GT", {
                                                            minimumFractionDigits: 2
                                                        })}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Estado */}
                                            <td className="px-4 py-4">
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200">
                                                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />

                                                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                                                        Pendiente
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4">

                                                <button
                                                    onClick={() => setSelected(user)}
                                                    className="group relative overflow-hidden px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all duration-300"
                                                >
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        Revisar
                                                        <span className="group-hover:translate-x-1 transition-transform">
                                                            →
                                                        </span>
                                                    </span>
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}
                </div>
            </div>

            {selected && (
                <ApproveModal
                    user={selected}
                    onClose={() => setSelected(null)}
                    onConfirm={handleApprove}
                    onDeny={handleDeny}
                    loading={loading}
                />
            )}
        </>
    );
};