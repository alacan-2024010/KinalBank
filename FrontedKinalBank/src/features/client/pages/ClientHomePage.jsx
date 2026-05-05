import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClientStore } from "../store/clientStore.js";
import { useAuthStore } from "../../auth/store/authStore.js";

const StatCard = ({ label, value, sub, icon, color = "indigo" }) => {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600",
        green:  "bg-green-50 text-green-600",
        blue:   "bg-blue-50 text-blue-600",
        amber:  "bg-amber-50 text-amber-600",
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
                {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
};

const AccountCard = ({ account, onClick }) => {
    const isActive = account.status === "ACTIVA";
    return (
        <div
            onClick={() => onClick(account)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-lg flex-shrink-0">
                    💳
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    isActive
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-500"
                }`}>
                    {account.status}
                </span>
            </div>
            <p className="text-[11px] text-gray-400 mb-1 font-mono tracking-widest">
                {account.accountNumber}
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
                {account.currency === "GTQ" ? "Q" : "$"}
                {" "}{Number(account.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400">{account.currency} · {account.accountType ?? "Cuenta de Ahorro"}</p>
        </div>
    );
};

const RecentTransactionRow = ({ tx }) => {
    const isCredit = tx.type === "DEPOSITO" || tx.type === "CREDITO";
    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                isCredit ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            }`}>
                {isCredit ? "↓" : "↑"}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                    {tx.description ?? tx.type}
                </p>
                <p className="text-[11px] text-gray-400">
                    {new Date(tx.createdAt).toLocaleDateString("es-GT", {
                        day: "2-digit", month: "short", year: "numeric"
                    })}
                </p>
            </div>
            <p className={`text-sm font-semibold flex-shrink-0 ${isCredit ? "text-green-600" : "text-red-500"}`}>
                {isCredit ? "+" : "-"}
                {tx.currency === "GTQ" ? "Q" : "$"}
                {Number(tx.amount).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
            </p>
        </div>
    );
};

export const ClientHomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { accounts, transactions, loading, fetchMyAccounts, fetchMyTransactions } = useClientStore();

    useEffect(() => {
        fetchMyAccounts();
        fetchMyTransactions(1);
    }, []);

    const totalGTQ = accounts
        .filter(a => a.currency === "GTQ" && a.status === "ACTIVA")
        .reduce((s, a) => s + Number(a.balance), 0);

    const totalUSD = accounts
        .filter(a => a.currency === "USD" && a.status === "ACTIVA")
        .reduce((s, a) => s + Number(a.balance), 0);

    const recentTx = transactions.slice(0, 5);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Encabezado */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Bienvenido{user?.name ? `, ${user.name}` : ""} 👋
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Aquí tienes un resumen de tu situación financiera.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Cuentas activas"
                    value={accounts.filter(a => a.status === "ACTIVA").length}
                    icon="💳"
                    color="indigo"
                />
                <StatCard
                    label="Total en GTQ"
                    value={`Q ${totalGTQ.toLocaleString("es-GT", { minimumFractionDigits: 2 })}`}
                    icon="🇬🇹"
                    color="green"
                />
                <StatCard
                    label="Total en USD"
                    value={`$ ${totalUSD.toLocaleString("es-GT", { minimumFractionDigits: 2 })}`}
                    icon="🇺🇸"
                    color="blue"
                />
                <StatCard
                    label="Movimientos"
                    value={transactions.length}
                    sub="últimos registrados"
                    icon="📋"
                    color="amber"
                />
            </div>

            {/* Mis cuentas */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-800">Mis cuentas</h2>
                    <button
                        onClick={() => navigate("/dashboard/client/accounts")}
                        className="text-sm text-indigo-600 font-medium hover:underline"
                    >
                        Ver todas →
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-400 text-sm">Cargando cuentas…</div>
                ) : accounts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
                        <p className="text-3xl mb-2">🏦</p>
                        <p className="text-sm">Aún no tienes cuentas asociadas.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {accounts.slice(0, 3).map((acc) => (
                            <AccountCard
                                key={acc._id}
                                account={acc}
                                onClick={() => navigate("/dashboard/client/accounts")}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Movimientos recientes */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-800">Movimientos recientes</h2>
                    <button
                        onClick={() => navigate("/dashboard/client/transactions")}
                        className="text-sm text-indigo-600 font-medium hover:underline"
                    >
                        Ver todos →
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-2">
                    {loading ? (
                        <p className="text-center text-gray-400 text-sm py-6">Cargando movimientos…</p>
                    ) : recentTx.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-6">Sin movimientos recientes.</p>
                    ) : (
                        recentTx.map((tx, i) => <RecentTransactionRow key={tx._id ?? i} tx={tx} />)
                    )}
                </div>
            </div>
        </div>
    );
};