import { useEffect, useState } from "react";
import { useDepositStore } from "../store/depositStore.js";
import { useAccountsStore } from "../store/accountStore.js";

export const DepositModal = () => {

    const { createDeposit, getDeposits } = useDepositStore();
    const { accounts, fetchAccounts } = useAccountsStore();

    const [isOpen, setIsOpen] = useState(false);

    const [formData, setFormData] = useState({
        accountId: "",
        amount: "",
        currency: "GTQ"
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleInputChange = ({ target }) => {
        const { name, value } = target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.accountId || !formData.amount) {
            alert("Completa todos los campos");
            return;
        }

        try {

            await createDeposit({
                ...formData,
                amount: Number(formData.amount)
            });

            await getDeposits();

            setFormData({
                accountId: "",
                amount: "",
                currency: "GTQ"
            });

            setIsOpen(false);

            alert("Depósito realizado correctamente");

        } catch (error) {
            console.log(error);

            alert("Error al realizar depósito");
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-sm"
            >
                + Nuevo Depósito
            </button>

            {/* Modal */}
            {
                isOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">

                        <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-7">

                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">

                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">
                                        Nuevo Depósito
                                    </h2>

                                    <p className="text-slate-500 text-sm mt-1">
                                        Realiza depósitos a cuentas bancarias
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-slate-400 hover:text-red-500 text-xl"
                                >
                                    ✕
                                </button>

                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                {/* Cuenta */}
                                <div>

                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Cuenta
                                    </label>

                                    <select
                                        name="accountId"
                                        value={formData.accountId}
                                        onChange={handleInputChange}
                                        className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                                    >
                                        <option value="">
                                            Selecciona una cuenta
                                        </option>

                                        {
                                            accounts?.map((account) => (
                                                <option
                                                    key={account._id}
                                                    value={account._id}
                                                >
                                                    {account.accountNumber}
                                                </option>
                                            ))
                                        }

                                    </select>

                                </div>

                                {/* Monto */}
                                <div>

                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Monto
                                    </label>

                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Ingrese el monto"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                                    />

                                </div>

                                {/* Moneda */}
                                <div>

                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Moneda
                                    </label>

                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleInputChange}
                                        className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                                    >
                                        <option value="GTQ">GTQ</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>

                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 pt-4">

                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition-all"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-medium transition-all"
                                    >
                                        Realizar Depósito
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>
                )
            }
        </>
    );
};