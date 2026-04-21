import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast";

export const LoginForm = ({ onForgot, onRegister }) => {

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const login = useAuthStore(state => state.login);
  const loading = useAuthStore(state => state.loading);

  const onSubmit = async (data) => {
    console.log(data);

    const res = await login(data);

    if (res.success) {
      toast.success("Bienvenido");
      navigate("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">
          Email
        </label>

        <input
          type="email"
          placeholder="correo@ejemplo.com"
          className="w-full px-3 py-2 border rounded-lg"
          {...register("email", {
            required: "El email es obligatorio"
          })}
        />

        {errors.email && (
          <p className="text-red-600 text-xs mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">
          Contraseña
        </label>

        <input
          type="password"
          placeholder="********"
          className="w-full px-3 py-2 border rounded-lg"
          {...register("password", {
            required: "La contraseña es obligatoria"
          })}
        />

        {errors.password && (
          <p className="text-red-600 text-xs mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2B3F6C] hover:bg-[#24345a] text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Iniciando..." : "Iniciar Sesión"}
      </button>

      <p className="text-center text-sm text-gray-600">
        <button
          type="button"
          onClick={onForgot}
          className="text-[#2B3F6C] hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </p>

      <p className="text-center text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <button
          type="button"
          onClick={onRegister}
          className="text-[#2B3F6C] font-medium hover:underline"
        >
          Registrarse
        </button>
      </p>

    </form>
  );
};