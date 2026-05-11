export const AccountOwnerModal = ({ account, onClose }) => {
    if (!account) return null;

    // Actualizado: ahora usa account.owner?.name
    const ownerInitial = (account.owner?.name || account.ownerId || "?")
        .charAt(0)
        .toUpperCase();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[28px] overflow-hidden border border-white/10 shadow-2xl shadow-slate-900/30">

                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#071126] via-[#0f1d3a] to-[#16284f] px-6 py-5">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                                {ownerInitial}
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg leading-tight">
                                    {/* Actualizado: account.owner?.name */}
                                    {account.owner?.name || "Propietario"}
                                </h2>
                                <p className="text-slate-400 text-sm mt-0.5">
                                    Cliente bancario
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/10 text-slate-300 hover:text-white transition-all"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="bg-white/90 backdrop-blur-xl px-6 py-5">

                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                        Información del propietario
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                            <p className="text-xs text-slate-400 mb-1">Nombre completo</p>
                            {/* Actualizado: account.owner?.name */}
                            <p className="font-semibold text-slate-800">{account.owner?.name || "—"}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                            <p className="text-xs text-slate-400 mb-1">Usuario</p>
                            <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                                {/* Actualizado: account.owner?.username */}
                                @{account.owner?.username || account.ownerId || "—"}
                            </span>
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                            <p className="text-xs text-slate-400 mb-1">Correo electrónico</p>
                            {/* Actualizado: account.owner?.email */}
                            <p className="font-medium text-slate-700 text-sm truncate">{account.owner?.email || "—"}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                            <p className="text-xs text-slate-400 mb-1">DPI</p>
                            <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                                {/* Actualizado: account.owner?.dpi */}
                                {account.owner?.dpi || "—"}
                            </span>
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                            <p className="text-xs text-slate-400 mb-1">Teléfono</p>
                            {/* Actualizado: account.owner?.phone */}
                            <p className="font-medium text-slate-700 text-sm">{account.owner?.phone || "—"}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                            <p className="text-xs text-slate-400 mb-1">Empleo</p>
                            {/* Actualizado: account.owner?.job */}
                            <p className="font-medium text-slate-600 text-sm">{account.owner?.job || "—"}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                            <p className="text-xs text-slate-400 mb-1">Ingreso mensual</p>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                                <span className="text-emerald-600 font-bold text-sm">
                                    {/* Actualizado: account.owner?.monthlyIncome */}
                                    Q {Number(account.owner?.monthlyIncome || 0).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="my-4 border-t border-slate-100" />

                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                        Información de la cuenta
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                            <p className="text-xs text-slate-400 mb-1">Número de cuenta</p>
                            <p className="font-bold text-slate-800 font-mono">{account.accountNumber || "—"}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                            <p className="text-xs text-slate-400 mb-1">Tipo de cuenta</p>
                            <p className="font-semibold text-slate-700 text-sm">{account.accountType || "—"}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                            <p className="text-xs text-slate-400 mb-1">Moneda</p>
                            <p className="font-semibold text-slate-700 text-sm">{account.currency || "—"}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                            <p className="text-xs text-slate-400 mb-1">Saldo actual</p>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                                <span className="text-emerald-600 font-bold text-sm">
                                    {account.currency === "USD" ? "$" : "Q"}{" "}
                                    {Number(account.balance || 0).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                            <p className="text-xs text-slate-400 mb-1">Estado</p>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                                <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                                    {account.status || "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white/90 backdrop-blur-xl px-6 py-4 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm transition-colors"
                    >
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    );
};