# 📦 Package Tracking System — *Angular Practice #2*

A **parcel tracking and management** app built with **Angular 20** (standalone components).  
Create orders, update their status, and view details with a clean, responsive UI.

---

## 🧭 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Running the App](#-running-the-app)
- [Usage](#-usage)
  - [Create Order](#create-order)
  - [Update Order](#update-order)
- [Validation Rules](#-validation-rules)
- [State Flow](#-state-flow)
- [Notes](#-notes)

---

## ✨ Features
- **Create Order** with robust form validation (letters-only name, Gmail/Outlook email, description length).
- **Update Order**: search by `packageNumber`, change status, log comment and responsible person.
- **Bootstrap UI**: cards, modals, and clear validation feedback.
- **Reactive Forms** with contextual error messages.
- **In-memory persistence** via `OrdersService` (simulated backend).

---

## 🛠 Tech Stack
- Angular 20+ (standalone components)
- TypeScript
- Bootstrap 5
- Reactive Forms / RxJS
- HTML5 / SCSS

---

## 📁 Project Structure
```txt
src/
└── app/
    ├── app.config.ts
    ├── app.routes.ts
    ├── core/
    │   └── orders.service.ts      # Service to manage orders
    └── componentes/
        ├── crear/                 # Create order
        │   ├── crear.ts
        │   ├── crear.html
        │   └── crear.scss
        ├── actualizar/            # Update order
        │   ├── actualizar.ts
        │   ├── actualizar.html
        │   └── actualizar.scss
        └── seguimiento/           # Optional tracking module
```
> Note: Folder names are in Spanish to match the UI.

---

## ⚙️ Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# Install dependencies
npm install
```

---

## ▶️ Running the App
```bash
# Start in development
ng serve
```
Open **http://localhost:4200** in your browser.

> **Optional (local network testing):**
> ```bash
> ng serve --host 0.0.0.0
> ```

---

## 📚 Usage

### Create Order
1. Navigate to the **“Crear”** tab.  
2. Fill in the required fields:
   - **Nombre** (letters and spaces only)
   - **Dirección** (required)
   - **Email** (**gmail.com** or **outlook.com** only)
   - **Descripción** (between **40** and **120** characters)
3. Click **Crear orden**.  
   A confirmation modal will display the generated **package number** and **identifier**.

### Update Order
1. Navigate to the **“Actualizar”** tab.  
2. Enter the **package number** (e.g., `ENV-2025-0001`) and click **Buscar**.  
3. Select a **valid next status**, add the **comment (20–40 chars)** and the **responsible person**.  
4. Click **Guardar actualización** to confirm.  
   A modal will confirm the successful update.

---

## ✅ Validation Rules
| Field                      | Rule                                   | Example                               |
|---------------------------|----------------------------------------|---------------------------------------|
| Nombre (Name)             | Letters and spaces only                | `Jon Doe`                          |
| Dirección (Address)       | Required                               | `Calle 10-45, Zona 12`                |
| Email                     | Gmail or Outlook domains only          | `usuario@gmail.com`                   |
| Descripción (Description) | 40–120 characters                      | `Contiene artículos frágiles.`        |
| Comentario (Comment)      | 20–40 characters                       | `Paquete preparado para despacho.`    |
| Responsable               | Letters and spaces only                | `Average Joe`                         |

---

## 🔁 State Flow
Status labels are in Spanish as used by the app:

- **Creado → En preparación → En tránsito → Entregado**
- **En preparación → No entregado**
- **En tránsito → No entregado**

> The **“No entregado”** status can be selected while the order is in **“En preparación”** or **“En tránsito”**.
> The UI only shows **valid transitions** based on the current state.

---

## 🗒 Notes
- Data is stored **in-memory** through `OrdersService` (no backend).
- Educational project: *Programación Web — Práctica #2 (2025)*.
- All UI components use **Bootstrap 5**.
