import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export const RegisterForm = ({ onSwitch }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const registerUser = useAuthStore(state => state.register);
    const loading = useAuthStore(state => state.loading);

    const onSubmit = async (data) => {
        const res = await registerUser(data);

        if (res.success) {
            toast.success("Registro exitoso, espera aprobación del administrador");
            onSwitch();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <input
                placeholder="Nombre completo"
                className="w-full px-3 py-2 border rounded-lg"
                {...register("name", { required: "Nombre requerido" })}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}

            <input
                placeholder="Username"
                className="w-full px-3 py-2 border rounded-lg"
                {...register("username", { required: "Username requerido" })}
            />

            <input
                type="email"
                placeholder="Correo"
                className="w-full px-3 py-2 border rounded-lg"
                {...register("email", { required: "Correo requerido" })}
            />

            <input
                type="password"
                placeholder="Contraseña"
                className="w-full px-3 py-2 border rounded-lg"
                {...register("password", { required: "Contraseña requerida" })}
            />

            <input
                placeholder="DPI"
                maxLength={13}
                className="w-full px-3 py-2 border rounded-lg"
                {...register("dpi", { required: "DPI requerido" })}
            />

            <input
                placeholder="Dirección"
                className="w-full px-3 py-2 border rounded-lg"
                {...register("address", { required: "Dirección requerida" })}
            />

            <input
                placeholder="Teléfono"
                className="w-full px-3 py-2 border rounded-lg"
                {...register("phone", { required: "Teléfono requerido" })}
            />

            <input
                placeholder="Trabajo"
                className="w-full px-3 py-2 border rounded-lg"
                {...register("job", { required: "Trabajo requerido" })}
            />

            <input
                type="number"
                placeholder="Ingresos mensuales"
                className="w-full px-3 py-2 border rounded-lg"
                {...register("monthlyIncome", { required: "Ingresos requeridos" })}
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2B3F6C] hover:bg-[#24345a] text-white py-2 rounded-lg"
            >
                {loading ? "Registrando..." : "Registrarse"}
            </button>

            <p className="text-center text-sm">
                ¿Ya tienes cuenta?{" "}
                <button
                    type="button"
                    onClick={onSwitch}
                    className="text-[#2B3F6C] font-medium"
                >
                    Iniciar sesión
                </button>
            </p>

        </form>
    );
};