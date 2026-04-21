import { useState } from "react"
import { ForgotPasswordForm } from "../components/ForgotPassword"
import { LoginForm } from "../components/LoginForm"
import { RegisterForm } from "../components/RegisterForm"

export const AuthPage = () => {
    const [isForgot, setIsForgot] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    return (
        <div style={{
            width: "100%",
            minHeight: "100vh",
            padding: "2rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <div className="auth-card fade-in" style={{
                width: "100%",
                maxWidth: "680px",
                padding: "2.5rem 4rem",
            }}>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.75rem" }}>
                    <img
                        src="/src/assets/img/KinalBank.png"
                        alt="KinalBank"
                        style={{ height: "80px", objectFit: "contain" }}
                    />
                </div>

                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#111827" }}>
                        {isForgot
                            ? "Recuperar contraseña"
                            : isRegister
                                ? "Crear cuenta"
                                : "Bienvenido"}
                    </h1>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
                        {isForgot
                            ? "Ingresa tus datos para continuar"
                            : isRegister
                                ? "Completa los datos para registrarte"
                                : "Ingresa a tu cuenta"}
                    </p>
                </div>

                {isForgot ? (
                    <ForgotPasswordForm onSwitch={() => setIsForgot(false)} />
                ) : isRegister ? (
                    <RegisterForm onSwitch={() => setIsRegister(false)} />
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