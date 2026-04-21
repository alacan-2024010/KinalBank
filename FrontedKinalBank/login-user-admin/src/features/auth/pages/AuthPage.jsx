import { useState } from "react"
import { ForgotPasswordForm } from "../components/ForgotPasswordForm"
import { LoginForm } from "../components/LoginForm"
import { RegisterForm } from "../components/RegisterForm"

export const AuthPage = () => {
    const [isForgot, setIsForgot] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-10">

                <div className="flex justify-center mb-6">
                    <img
                        src="/src/assets/img/KinalBank.png"
                        alt="KinalBank"
                        className="h-20 w-auto"
                    />
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-2xl lf:text-3xl font-bold text-gray-900 mb-2">
                        {isForgot
                            ? "Recuperar Contraseña"
                            : isRegister
                                ? "Crear Cuenta"
                                : "Bienvenido de Nuevo"
                        }
                    </h1>

                    <p className="text-gray-600 text-base max-w-md mx-auto">
                        {isForgot
                            ? "Ingresa tus datos para recuperar tu contraseña"
                            : isRegister
                                ? "Completa los datos para registrarte"
                                : "Ingresa a tu cuenta de administrador Kinal Bank"
                        }
                    </p>
                </div>

                {isForgot ? (
                    <ForgotPasswordForm
                        onSwitch={() => {
                            setIsForgot(false)
                        }}
                    />
                ) : isRegister ? (
                    <RegisterForm
                        onSwitch={() => {
                            setIsRegister(false)
                        }}
                    />
                ) : (
                    <LoginForm
                        onForgot={() => setIsForgot(true)}
                        onRegister={() => setIsRegister(true)}
                    />
                )}

            </div>
        </div>
    )
}