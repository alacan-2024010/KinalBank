import { useEffect } from "react";
import { DepositTable } from "../components/DepositTable.jsx";
import { DepositModal } from "../components/DepositModal.jsx";
import { useDepositStore } from "../store/depositStore.js";

export const DepositPage = () => {

    const { deposits, getDeposits } = useDepositStore();

    useEffect(() => {
        getDeposits();
    }, []);

    return (
        <div className="w-full min-h-screen">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Gestión de Depósitos
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Administra y visualiza todos los depósitos realizados
                    </p>
                </div>

                <DepositModal />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                    <p className="text-sm text-slate-500 mb-2">
                        Total Depósitos
                    </p>

                    <h2 className="text-3xl font-bold text-slate-800">
                        {deposits.length}
                    </h2>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                    <p className="text-sm text-slate-500 mb-2">
                        Completados
                    </p>

                    <h2 className="text-3xl font-bold text-green-600">
                        {
                            deposits.filter(
                                (deposit) => deposit.estado === "COMPLETADO"
                            ).length
                        }
                    </h2>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                    <p className="text-sm text-slate-500 mb-2">
                        Revertidos
                    </p>

                    <h2 className="text-3xl font-bold text-red-500">
                        {
                            deposits.filter(
                                (deposit) => deposit.estado === "REVERTIDO"
                            ).length
                        }
                    </h2>
                </div>

            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <DepositTable deposits={deposits} />
            </div>

        </div>
    );
};