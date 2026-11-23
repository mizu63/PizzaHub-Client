# 🍕 PizzaHub — Food Ordering Platform

PizzaHub is a modern and responsive food ordering platform where customers can explore delicious food items, place orders, and manage their purchases. Vendors can manage their menus and subscriptions, while administrators can monitor platform activities through a dedicated dashboard.

🌐 **Live Website:** https://pizzahub-client-beryl-seven.vercel.app/

🖥️ **Frontend Repository:** https://github.com/mizu63/PizzaHub-Client

⚙️ **Backend Repository:** https://github.com/mizu63/PizzaHub-Server

---

## ✨ Key Features

### 👤 Authentication & User Management
- User registration and login.
- Secure authentication with Better Auth.
- Role-based access for Customers, Vendors, and Admins.
- User profile management.

### 🍕 Customer Features
- Browse available food items.
- View detailed menu information.
- Place food orders.
- View personal order history.
- Cancel pending orders.
- Track order status.

### 🏪 Vendor Features
- Add new menu items.
- Update and delete menu items.
- Manage menu availability.
- Search and filter menu items.
- Sort menu items by price.
- Manage subscription plans.

### 🛡️ Admin Features
- Manage platform users.
- Manage menu items.
- Manage orders and transactions.
- View dashboard statistics.
- Monitor platform activities.

### 💳 Payment & Subscription
- Stripe Checkout integration.
- Vendor subscription management.
- Premium subscription features.
- Subscription cancellation and expiration handling.
- Stripe webhook integration.

### 📊 Dashboard
- Role-based dashboards.
- Dashboard statistics.
- Charts and graphs.
- Responsive dashboard interface.

---

## 🛠️ Technologies Used

### Frontend
- Next.js
- React.js
- TypeScript
- Tailwind CSS
- HTML5
- CSS3

### Authentication & API
- Better Auth
- REST API
- Fetch API

### Payment & Image Upload
- Stripe
- ImgBB

### Development & Deployment
- Git
- GitHub
- VS Code
- Vercel

---

## 🚀 Getting Started

Follow these instructions to run the frontend project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/mizu63/PizzaHub-Client.git
```

### 2. Navigate to the Project Folder

```bash
cd PizzaHub-Client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root directory.

Add the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

Replace the ImgBB placeholder with your own API key. Never commit real API keys or secrets to GitHub.

### 5. Run the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

**Note:** The PizzaHub backend server must also be running for authentication, menu data, orders, and other API-dependent features to work.

---

## 📁 Project Structure

```text
PizzaHub-Client/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   ├── customer/
│   │   │   └── vendor/
│   │   │
│   │   ├── menu/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   └── lib/
│       └── auth-client.ts
│
├── .env.local
├── package.json
├── next.config.ts
└── README.md
```

---

## 🌍 Deployment

The frontend application is deployed on Vercel.

**Live URL:** https://pizzahub-client-beryl-seven.vercel.app/

---

## 👨‍💻 Developer

**MD. MIZU AHMMED JIM**

- GitHub: https://github.com/mizu63
- Frontend Repository: https://github.com/mizu63/PizzaHub-Client
- Backend Repository: https://github.com/mizu63/PizzaHub-Server

---

## 📄 License

This project was developed for educational purposes as part of Programming Hero Assignment 9.
