import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore.js";
import toast from "react-hot-toast";
 
export const ForgotPasswordForm = ({ onSwitch }) => {
 
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
 
  const newPassword = watch("newPassword");
 
  const forgotPassword = useAuthStore(state => state.forgotPassword);
  const loading = useAuthStore(state => state.loading);
 
  const onSubmit = async (data) => {
    const res = await forgotPassword(data);
 
    if (res.success) {
      toast.success("Contraseña actualizada");
      onSwitch();
    }
  };
 
  return (
 
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
 
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">
          Username
        </label>
 
        <input
          placeholder="Username"
          className="w-full px-3 py-2 border rounded-lg"
          {...register("username", { required: "El username es obligatorio" })}
        />
 
        {errors.username && (
          <p className="text-red-600 text-xs mt-1">
            {errors.username.message}
          </p>
        )}
      </div>
 
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">
          DPI
        </label>
 
        <input
          placeholder="DPI"
          className="w-full px-3 py-2 border rounded-lg"
          {...register("dpi", { required: "El DPI es obligatorio" })}
        />
 
        {errors.dpi && (
          <p className="text-red-600 text-xs mt-1">
            {errors.dpi.message}
          </p>
        )}
      </div>
 
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">
          Nueva contraseña
        </label>
 
        <input
          type="password"
          placeholder="********"
          className="w-full px-3 py-2 border rounded-lg"
          {...register("newPassword", { required: "La contraseña es obligatoria" })}
        />
 
        {errors.newPassword && (
          <p className="text-red-600 text-xs mt-1">
            {errors.newPassword.message}
          </p>
        )}
      </div>
 
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">
          Confirmar contraseña
        </label>
 
        <input
          type="password"
          placeholder="********"
          className="w-full px-3 py-2 border rounded-lg"
          {...register("confirmPassword", {
            validate: value =>
              value === newPassword || "Las contraseñas no coinciden"
          })}
        />
 
        {errors.confirmPassword && (
          <p className="text-red-600 text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
 
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2B3F6C] hover:bg-[#24345a] text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Actualizando..." : "Cambiar contraseña"}
      </button>
 
      <p className="text-center text-sm text-gray-600">
        <button
          type="button"
          onClick={onSwitch}
          className="text-[#2B3F6C] hover:underline"
        >
          Volver al login
        </button>
      </p>
 
    </form>
 
  );
};