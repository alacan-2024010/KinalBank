# 🏦 KinalBank — Sistema Bancario

Sistema bancario con autenticación JWT, roles diferenciados (Admin / Cliente) y API de divisas integrada.

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Configuración del Servicio de Autenticación](#-configuración-del-servicio-de-autenticación)
- [Configuración del Sistema Bancario](#-configuración-del-sistema-bancario)
- [Configuración de la API de Divisas](#-configuración-de-la-api-de-divisas)
- [Prueba de Endpoints con Postman](#-prueba-de-endpoints-con-postman)
- [Roles y Tokens](#-roles-y-tokens)

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado y en ejecución:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [pgAdmin 4](https://www.pgadmin.org/)
- [Node.js + pnpm](https://pnpm.io/)
- [Postman](https://www.postman.com/)

---

## 🔐 Configuración del Servicio de Autenticación

> Ruta requerida: `C:\IN6BM Folgar\KinalBank\SistemaBancario\AuthBanco`

### Pasos

**1. Preparar la base de datos**

Abre **pgAdmin 4** y crea una base de datos con los siguientes datos:

| Campo | Valor |
|-------|-------|
| Nombre | `KinalBankAuth` |
| Owner | `root` |

**2. Levantar el contenedor de PostgreSQL**

Abre Docker Desktop y ejecuta en la terminal:

```bash
docker run -d --name kinalbank-postgres \
  -e POSTGRES_DB=KinalBankAuth \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=admin \
  -p 5436:5432 postgres:16
```

> ✅ Verifica en Docker Desktop que el contenedor `kinalbank-postgres` esté activo antes de continuar.

**3. Instalar dependencias e iniciar**

```bash
# Instalar dependencias
pnpm install nodemon

# Iniciar la API de autenticación
pnpm run dev
```

---

## 🏧 Configuración del Sistema Bancario

> Ruta requerida: `C:\IN6BM Folgar\KinalBank\SistemaBancario\SistemaBancario`

```bash
# 1. Instalar dependencias
pnpm install nodemon
pnpm add axios

# 2. Iniciar la API
pnpm run dev
```

> ⚠️ **Importante:** Cada petición debe llevar su **Bearer Token** correspondiente según el rol (`ADMIN` o `CLIENTE`). El token se obtiene al iniciar sesión en el servicio de autenticación.

### Flujo de autenticación

```
1. Iniciar sesión en AuthBanco
        ↓
2. Obtener el token JWT (Admin o Cliente)
        ↓
3. En Postman → Authorization → Bearer Token → pegar el token
```

---

## 💱 Configuración de la API de Divisas

> Ruta requerida: `C:\IN6BM Folgar\KinalBank\SistemaBancario\ApiDivisas`

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar la API
pnpm run dev
```

---

## 📬 Prueba de Endpoints con Postman

Los endpoints están disponibles en los siguientes workspaces públicos de Postman:

| Servicio | Enlace |
|----------|--------|
| 🔐 AuthBanco | [KinalBank APIs — Postman](https://www.postman.com/aalvarez-2024004-2419738/workspace/kinalbank-apis) |
| 🏧 Sistema Bancario | [Sistema Bancario — Postman](https://alacan-2024010-3215566.postman.co/workspace/EJEMPLO~3a315322-cf2c-4a64-8448-ab67e4d8e872/request/48332460-d96402d2-8d02-4514-b1f5-ff2c1d5d31ba) |

---

## 👥 Roles y Tokens

| Rol | Descripción | Token requerido |
|-----|-------------|-----------------|
| `ADMIN` | Acceso a endpoints administrativos | Token de Admin |
| `CLIENTE` | Acceso a endpoints de usuario | Token de Cliente |

> 🔑 El token se obtiene **únicamente al iniciar sesión** y debe enviarse como **Bearer Token** en Authorization de cada petición protegida.

---

<p align="center">
  Desarrollado con ❤️ para <strong>KinalBank</strong>
</p>
