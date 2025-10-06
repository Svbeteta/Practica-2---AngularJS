# 📦 Package Tracking System (Angular Practice #2)

This project is a **package tracking management system** built with **Angular 20 (standalone components)**.  
It allows users to **create**, **update**, and **follow** package orders with a simple and responsive interface.  
Developed as part of *Programming Web – Practice #2 (2025)*.

---

## 🚀 Features

- **Create Order** – Register new delivery orders with validations (only Gmail/Outlook domains, letter-only names, description length, etc.).
- **Update Order** – Search for existing orders, change their status, and add responsible staff comments.
- **Bootstrap UI** – Clean and modern interface using Bootstrap modals, alerts, and responsive cards.
- **Form Validation** – Dynamic validation feedback and smart disabling of buttons until all requirements are met.
- **Local Order Management** – Orders are stored in memory via `OrdersService`, simulating a backend.

---

## 🧩 Technologies Used

- **Angular 20+ (standalone components)**
- **TypeScript**
- **Bootstrap 5**
- **Reactive Forms**
- **RxJS**
- **HTML5 / SCSS**

---

## 📁 Project Structure

src/
├── app/
│ ├── app.config.ts
│ ├── app.routes.ts
│ ├── core/
│ │ └── orders.service.ts # Service to manage orders
│ ├── componentes/
│ │ ├── crear/ # Create order
│ │ │ ├── crear.ts
│ │ │ ├── crear.html
│ │ │ └── crear.scss
│ │ ├── actualizar/ # Update order
│ │ │ ├── actualizar.ts
│ │ │ ├── actualizar.html
│ │ │ └── actualizar.scss
│ │ └── seguimiento/ # Tracking module (optional)
│ └── app.html / app.ts

yaml
Copy code

---

## ⚙️ Installation & Setup

1. **Clone this repository**

   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
Install dependencies

bash
Copy code
npm install
Run the application

bash
Copy code
ng serve
Access it in your browser

arduino
Copy code
http://localhost:4200
(Optional) Run it on a local network to test from other devices:

bash
Copy code
ng serve --host 0.0.0.0
🧠 Usage
🔹 Creating an Order
Go to the “Create” tab.

Fill in all required fields:

Name – Letters only

Address – Required

Email – Must be Gmail or Outlook

Description – Between 40 and 120 characters

Click Create Order to register it.
A confirmation modal will appear with the generated package number and identifier.

🔹 Updating an Order
Go to the “Update” tab.

Enter the Package Number and click Search.

Modify its status (e.g., “In preparation”, “In transit”, “Delivered”, etc.).

Add a comment (20–40 chars) and responsible person’s name.

Click Save Update to confirm.
A modal will confirm the successful update.

🧪 Validation Rules Summary
Field	Validation	Example
Name	Only letters and spaces	Juan Pérez
Address	Required	Calle 10-45, Zona 12
Email	Must be Gmail or Outlook	usuario@gmail.com
Description	40–120 characters	Contains fragile glass items.
Comment (update)	20–40 characters	Package prepared for delivery

🖼️ Screenshots
Create Order

Update Order

💡 Notes
This app simulates data storage only in the client (no backend).

Designed for educational purposes under Programming Web – Practice #2 (2025).

All UI elements use Bootstrap 5 for layout and feedback.

👨‍💻 Author
Samuel Beteta
Universidad Mesoamericana – Systems Engineering

