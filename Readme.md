# Backend for SaaS Product - DAKSH

## Description

This is the backend for **DAKSH**, a SaaS-based product. It is built using **Node.js**, **Express.js**, and **PostgreSQL** (via Prisma ORM). It provides APIs for authentication, user management, communities, and more.

## 📂 Folder Structure

```
backend/
│── controllers/       # Contains controller functions for handling business logic
│── middlewares/       # Contains custom middleware for authentication and security
│── node_modules/      # Dependencies (ignored in version control)
│── prisma/            # Prisma ORM setup and migrations
│── routes/            # Express route handlers
│── utils/             # Utility functions
│── .env               # Environment variables (ignored in version control)
│── .gitignore         # Files to be ignored by Git
│── index.js           # Entry point for the application
│── package.json       # Project metadata and dependencies
│── package-lock.json  # Lockfile for package versions
│── README.md          # Documentation (You're reading this!)
│── LICENSE.md         # License information
```

## 🚀 Installation

### 1️⃣ Prerequisites

- **Node.js** (v16+ recommended)
- **PostgreSQL Database** (Hosted on NeonDB or local instance)
- **Prisma CLI** (for managing database schema)

### 2️⃣ Setup & Run

```sh
# Clone the repository
git clone https://github.com/your-repo/backend-daksh.git
cd backend-daksh

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env   # Edit .env file with your database and API keys

# Run Prisma migration
npx prisma migrate dev --name init

# Start the server
npm run dev  # Uses nodemon for hot-reloading (Development mode)
npm start    # Runs the server normally (Production mode)
```

## 🌍 Environment Variables (.env)

Ensure the following variables are set in your `.env` file:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secret_key"
CLOUDINARY_URL="your_cloudinary_api_url"
```

## ⚡ API Endpoints

### Authentication

- `POST /auth/register` → Register a new user
- `POST /auth/login` → Login and receive tokens
- `POST /auth/refresh` → Get new access token using refresh token

### Community Management

- `GET /community/:id` → Get community by ID
- `POST /create-community` → Create a new community
- `PUT /update-community/:id` → Update community details
- `DELETE /delete-community/:id` → Remove a community

### User & Todos

- `GET /user/:id` → Get user details
- `POST /todo` → Create a new to-do
- `PUT /todo/:id` → Update a to-do
- `DELETE /todo/:id` → Delete a to-do

(See full API documentation for more details.)

## 🛠️ Technologies Used

- **Node.js & Express.js** - Backend framework
- **PostgreSQL (NeonDB)** - Database
- **Prisma ORM** - Database ORM
- **JWT (jsonwebtoken)** - Authentication
- **Helmet, Rate-limit, HPP** - Security Enhancements
- **Multer & Cloudinary** - File uploads
- **PM2** - Process manager for production

## 🔒 Security Features

✅ **JWT-based authentication** (Access & Refresh tokens)  
✅ **Rate limiting** to prevent abuse  
✅ **Input sanitization** using `express-mongo-sanitize`  
✅ **Helmet** for setting secure HTTP headers  
✅ **CORS** configuration for API security

## 📝 License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.

## 📬 Contact

## FrontEnd RepoSitoryUrl [Daksh-Frontend](https://github.com/AngadSudan/daksh-saas-frontend.git)

- **Author**: Angad Sudan
- **Email**: [angadsudan453@example.com]
- **LinkedIn**: [linkedin.com/in/AngadSudan](https://linkedin.com/in/AngadSudan)
