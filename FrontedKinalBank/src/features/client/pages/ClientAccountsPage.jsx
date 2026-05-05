import { useEffect } from "react";
import { useClientStore } from "../store/clientStore.js";

const AccountCard = ({ account }) => {
    const isActive = account.status === "ACTIVA";
    const symbol = account.currency === "GTQ" ? "Q" : "$";

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
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
                {symbol} {Number(account.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mb-5">
                {account.currency} · {account.accountType ?? "Cuenta de Ahorro"}
            </p>

            <div className="border-t border-gray-50 pt-4 space-y-2">
                {account.owner && (
                    <InfoRow label="Titular" value={account.owner} />
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
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-medium text-gray-700">{value}</span>
    </div>
);

export const ClientAccountsPage = () => {
    const { accounts, loading, error, fetchMyAccounts } = useClientStore();

    useEffect(() => {
        fetchMyAccounts();
    }, []);

    const activas = accounts.filter(a => a.status === "ACTIVA");
    const inactivas = accounts.filter(a => a.status !== "ACTIVA");

    return (
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
                    <p className="text-xs text-gray-300 mt-1">Contacta con el banco para abrir una cuenta.</p>
                </div>
            ) : (
                <>
                    {activas.length > 0 && (
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Cuentas activas
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {activas.map((acc) => (
                                    <AccountCard key={acc._id} account={acc} />
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
                                {inactivas.map((acc) => (
                                    <AccountCard key={acc._id} account={acc} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};