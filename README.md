# EcomGrove

EcomGrove is a modern and scalable eCommerce platform designed for seamless online shopping.

## Tech Stack

**Frontend:** React, TailwindCSS, Docker, Vite (TypeScript)  
**Backend:** Node.js, NestJS, Prisma ORM, MySQL, Redis, Docker  

## Prerequisites

Ensure the following are installed on your system:

- **Node.js** (latest version)
- **npm** (or yarn)
- **Git**
- **MySQL Server & MySQL Workbench**

## Project Setup

### 1. Clone the project
```bash
git clone git@github.com:Keiter0309/EcomGrove.git
cd EcomGrove
```

### 2. Install Dependencies

#### **Frontend Installation**
```bash
cd fe
npm install
```

#### **Backend Installation**
```bash
cd be
npm install
```

## Environment Configuration

Create the required environment variable files for both frontend and backend.

### **Frontend Environment (`fe/.env`)**
```ini
VITE_SERVER_URI=YOUR_API_URL
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

### **Backend Environment (`be/.env.development`)**
```ini
DB_HOST=localhost
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=ecommerce-project

NODE_ENV=development # or production

# Google Email Configuration
GOOGLE_EMAIL=your_email
GOOGLE_PASSWORD=your_app_password
GOOGLE_CLIENT_ID=your_client_id

# SMTP Configuration
MAIL_HOST=your_mail_host
MAIL_PORT=your_mail_port
MAIL_USER=your_mail_user
MAIL_PASSWORD=your_mail_password
MAIL_FROM=your_email

# Database Connection URL
DATABASE_URL="mysql://your_username:your_password@localhost:3306/ecommerce-project"

# JWT Configuration
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h

# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_region_name
AWS_BUCKET_NAME=your_bucket_name

# Server Configuration
PORT=9000
```

### **Prisma Configuration (`be/prisma/.env`)**
```ini
DATABASE_URL="mysql://your_username:your_password@localhost:3306/ecommerce-project"
```

## Database Setup

Ensure **MySQL Server is running** before proceeding.

### **Initialize Prisma**
```bash
cd be
npx prisma generate
npx prisma migrate dev --name init
```

If applying existing migrations (e.g., in production), use:
```bash
npx prisma migrate deploy
```

To sync the schema without migration:
```bash
npx prisma db push
```

✅ **Check MySQL Workbench to confirm the database is created correctly.**  

## Running the Application

### **Start Frontend**
```bash
cd fe
npm run dev
```

### **Start Backend**
```bash
cd be
npm run dev
```

## Development Notes

- Ensure **MySQL is running** before launching the backend server.
- Replace **all placeholder values** in `.env` files with actual credentials and configurations.
- Use **`npx prisma migrate deploy`** to apply existing migrations in production.

## Troubleshooting

- **Installation Issues:** Verify all prerequisites are installed.
- **Database Errors:** Ensure MySQL is running and credentials are correct.
- **Environment Issues:** Double-check environment variables in `.env` files.
- **Port Conflicts:** Ensure port **9000** is available for the backend.

---

This README provides **clear, structured, and beginner-friendly** setup instructions for EcomGrove. 🚀 Let me know if you need any more refinements!

