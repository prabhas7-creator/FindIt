# FindIt — Lost & Found Portal

> **"Lost Something? Let's Find It."**

A modern, full-stack web application designed for college campuses and community institutions to report misplaced belongings, broadcast found items, search listings with intelligent filtering, securely communicate with finders/owners, and resolve claims.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Problem Statement & Objectives](#-problem-statement--objectives)
3. [Key Features](#-key-features)
4. [Technology Stack](#-technology-stack)
5. [System Architecture & Folder Structure](#-system-architecture--folder-structure)
6. [Database Schema & Data Models](#-database-schema--data-models)
7. [Prerequisites](#-prerequisites)
8. [Local Development Setup](#-local-development-setup)
9. [MongoDB Atlas Setup Guide](#-mongodb-atlas-setup-guide)
10. [Environment Variables](#-environment-variables)
11. [REST API Documentation](#-rest-api-documentation)
12. [Automated Testing & Results](#-automated-testing--results)
13. [GitHub Publishing Guide](#-github-publishing-guide)
14. [Deployment Guide (Render & Vercel)](#-deployment-guide-render--vercel)
15. [Security & Privacy Features](#-security--privacy-features)
16. [College Viva Explanation Guide](#-college-viva-explanation-guide)
17. [10 Likely Viva Questions & Answers](#-10-likely-viva-questions--answers)

---

## 🌟 Project Overview

**FindIt** bridges the communication gap between individuals who have lost personal property and honest finders on campus. In traditional setups, students rely on cluttered WhatsApp groups, unofficial noticeboards, or lost-and-found boxes where items often sit unclaimed. FindIt provides a clean, searchable, privacy-first portal where reports are tracked from initial discovery to successful handover.

---

## 🎯 Problem Statement & Objectives

### Problem Statement
- College campuses experience hundreds of lost items weekly (student IDs, calculators, wallets, water bottles, keys, headphones).
- Physical lost-and-found counters have limited hours and lack searchable records.
- Social media broadcasts quickly get lost in chat streams and expose students' private phone numbers and email addresses to the entire community.

### Objectives
1. **Centralization**: Create a unified digital registry for all lost and found reports.
2. **Fast Discovery**: Provide real-time keyword search and category/date filtering.
3. **Privacy-Preserving Contact**: Enable claimants to message reporters securely without publishing phone numbers or raw emails publicly.
4. **Lifecycle Accountability**: Track items through statuses (`ACTIVE` → `RESOLVED`) so community members know when an item has been reclaimed.

---

## ✨ Key Features

- **Responsive Landing Page**: Hero section, live portal statistics from MongoDB, recent listings carousel, category explorer, and campus safety reminders.
- **Lost & Found Reporting**: Distinct, intuitive forms with category selection, date verification, campus location tagging, and image uploads (file or URL) with fallback illustrations.
- **Search & Multi-Filter Engine**: Real-time search across item titles, descriptions, and locations; filter by Lost/Found, Category, Status (`ACTIVE`/`RESOLVED`), and Sort order.
- **JWT & Secure Cookie Authentication**: User registration, login, profile updates, and protected routes with `bcrypt` salt hashing and rate limiting.
- **Contact Request Workflow**: Secure inquiry system allowing claimants to message reporters with identifying details without exposing personal contact info.
- **Owner Dashboard**: Personalized statistics, tabbed listings (`All`, `Lost`, `Found`, `Resolved`), inline status toggling, and report editing/deletion with ownership authorization.
- **Resilient Database Layer**: Works seamlessly with cloud MongoDB Atlas and includes an auto-fallback in-memory development runner for zero-setup local demonstration.

---

## 🛠 Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 6, React Router DOM 6 | Modern, component-based single page application (SPA) |
| **Styling** | Tailwind CSS 3, Lucide React Icons | Custom curated palette (`#101D36` Navy, `#62D8C3` Teal) |
| **Backend** | Node.js, Express.js | Modular RESTful API server with centralized error handling |
| **Database** | MongoDB Atlas, Mongoose ODM | Document-based schema validation, indexing, and relations |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js, Express-Rate-Limit, Cookie-Parser | Password hashing, route guards, anti-brute force protection |
| **Testing** | Jest, Supertest, MongoMemoryServer | Automated unit and integration testing suite |

---

## 🏗 System Architecture & Folder Structure

```
FindIt/
├── client/                     # Frontend React + Vite application
│   ├── public/
│   │   ├── favicon.svg         # Tab icon
│   │   └── logo.svg            # FindIt brand emblem
│   ├── src/
│   │   ├── components/         # Reusable UI widgets
│   │   │   ├── CategoryIcon.jsx
│   │   │   ├── ContactRequestModal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   ├── ItemForm.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global session state & auth methods
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx  # Page frame (Navbar + Content + Footer)
│   │   ├── pages/
│   │   │   ├── BrowseItems.jsx # Multi-field search & filters
│   │   │   ├── ContactRequests.jsx # Incoming / Sent claims
│   │   │   ├── Dashboard.jsx   # User statistics & management
│   │   │   ├── EditItem.jsx    # Report editor
│   │   │   ├── FoundItems.jsx  # Found items view
│   │   │   ├── Home.jsx        # Landing page with live stats
│   │   │   ├── ItemDetails.jsx # Complete item view & contact CTA
│   │   │   ├── Login.jsx       # Sign in with 1-click demo buttons
│   │   │   ├── LostItems.jsx   # Lost items view
│   │   │   ├── NotFound.jsx    # Custom 404 page
│   │   │   ├── Profile.jsx     # Profile management
│   │   │   ├── Register.jsx    # Student account creation
│   │   │   └── ReportFound.jsx # Found submission form
│   │   │   └── ReportLost.jsx  # Lost submission form
│   │   ├── services/
│   │   │   └── api.js          # Axios client with credentials & interceptors
│   │   ├── utils/
│   │   │   ├── constants.js    # Categories, fallback imagery, brand info
│   │   │   └── formatters.js   # Date & string utility functions
│   │   ├── App.jsx             # Route definitions (14 routes)
│   │   ├── index.css           # Tailwind base styles & theme tokens
│   │   └── main.jsx            # Application entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Resilient MongoDB Atlas / In-Memory connector
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── itemController.js
│   │   │   └── requestController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT verification & req.user injection
│   │   │   └── errorMiddleware.js  # Centralized error & 404 handler
│   │   ├── models/
│   │   │   ├── ContactRequest.js   # Inquiries & claims model
│   │   │   ├── Item.js             # Lost/Found listings model
│   │   │   └── User.js             # Student user accounts model
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── healthRoutes.js
│   │   │   ├── itemRoutes.js
│   │   │   └── requestRoutes.js
│   │   ├── utils/
│   │   │   ├── jwt.js              # Token generator & cookie options
│   │   │   ├── seed.js             # Standalone development seed script
│   │   │   └── seedHelper.js       # Auto-seed helper for demo data
│   │   ├── app.js                  # Express middleware & route bindings
│   │   └── server.js               # Server bootstrapper & listener
│   ├── tests/
│   │   └── api.test.js             # 12 automated test cases
│   ├── jest.config.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore                  # Security-first ignore file
├── .env.example                # Root environment template
├── package.json                # Unified workspace scripts
└── README.md                   # Project documentation
```

---

## 🗄 Database Schema & Data Models

### 1. User Model (`User.js`)
- `name`: String (Required, trimmed, max 60 chars)
- `email`: String (Required, unique, lowercase, regex-validated)
- `passwordHash`: String (Required, excluded from default queries via `select: false`)
- `phone`: String (Optional, for contact coordination)
- `timestamps`: `createdAt`, `updatedAt`

### 2. Item Model (`Item.js`)
- `title`: String (Required, trimmed, max 120 chars)
- `type`: Enum `['LOST', 'FOUND']` (Required)
- `category`: Enum (9 campus categories: `Electronics`, `Documents and ID Cards`, `Bags and Backpacks`, `Keys`, `Clothing`, `Books and Stationery`, `Jewellery and Accessories`, `Wallets and Money`, `Other`)
- `description`: String (Required, max 2000 chars)
- `location`: String (Required, max 150 chars)
- `incidentDate`: Date (Required)
- `imageUrl`: String (Optional URL or base64 image data)
- `status`: Enum `['ACTIVE', 'RESOLVED']` (Default: `ACTIVE`)
- `userId`: ObjectId reference to `User` (Indexed)
- `timestamps`: `createdAt`, `updatedAt`
- *Compound Indexes*: `{ type: 1, status: 1, createdAt: -1 }`, text index on title, description, and location.

### 3. ContactRequest Model (`ContactRequest.js`)
- `itemId`: ObjectId reference to `Item` (Indexed)
- `senderId`: ObjectId reference to `User` (Claimant/Finder)
- `recipientId`: ObjectId reference to `User` (Listing owner)
- `message`: String (Required, max 1000 chars)
- `senderContact`: String (Phone or email provided for return coordination)
- `status`: Enum `['PENDING', 'ACCEPTED', 'REJECTED']` (Default: `PENDING`)
- `timestamps`: `createdAt`, `updatedAt`

---

## ⚡ Prerequisites

Before running the application locally, ensure you have:
- **Node.js**: Version 18.x or higher (Node v20+ recommended).
- **npm**: Version 9.x or higher.
- *(Optional)* **MongoDB**: Local MongoDB instance or free MongoDB Atlas account.

---

## 🚀 Local Development Setup

### 1. Clone or Open the Repository
```bash
git clone https://github.com/<your-username>/lost-and-found-portal.git
cd lost-and-found-portal
```

### 2. Install Dependencies
You can install dependencies for both the frontend and backend with a single command from the root directory:
```bash
npm run install:all
```
*(Or navigate to `client` and `server` independently and run `npm install`).*

### 3. Configure Environment Variables
Copy `.env.example` into `server/.env`:
```bash
cp server/.env.example server/.env
```
Inside `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/findit
JWT_SECRET=findit_college_project_jwt_secret_key_super_secure_2026
JWT_EXPIRES_IN=7d
```
> **Note**: If you don't have a local MongoDB daemon running, the application will automatically start a zero-setup in-memory database runner (`mongodb-memory-server`) so you can test immediately without any errors!

### 4. Seed Demonstration Data (Optional)
To seed realistic student reports:
```bash
npm run seed
```
Demo student accounts created:
1. `aarav.sharma@college.edu` | Password: `DemoStudent123!`
2. `priya.patel@college.edu`  | Password: `DemoStudent123!`
3. `rohan.verma@college.edu`  | Password: `DemoStudent123!`

### 5. Run the Application
Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
npm run dev:server
# Server starts at http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev:client
# Frontend opens at http://localhost:5173
```

Open your browser at **`http://localhost:5173`**!

---

## ☁️ MongoDB Atlas Setup Guide

To connect FindIt to a persistent, cloud-hosted MongoDB Atlas database:

1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and register a free account.
2. Click **Create a Deployment** and select the **M0 Free Tier** cluster (choose AWS or Google Cloud in your closest region).
3. Under **Security Quickstart**:
   - Create a database user with username and strong password (e.g., `findit_admin` and a secure password).
   - Under **Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere (`0.0.0.0/0`)** so your local machine and cloud hosting can connect.
4. Click **Clusters** → **Connect** → **Drivers** (Node.js).
5. Copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/findit?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your database user credentials.
7. Paste this URI into `server/.env` as `MONGODB_URI`.

---

## 🔒 Environment Variables

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port for the Express backend server | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:5173` or production URL |
| `MONGODB_URI` | Connection string for MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/findit` |
| `JWT_SECRET` | Secret key for signing authentication tokens | Long random alphanumeric string |
| `JWT_EXPIRES_IN` | Token duration before expiry | `7d` |

---

## 📡 REST API Documentation

All API responses return consistent JSON with `{ success: true, ... }` or `{ success: false, message: ... }`.

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register student account with hashed password | Public |
| `POST` | `/api/auth/login` | Login user, issue JWT token & HttpOnly cookie | Public |
| `POST` | `/api/auth/logout` | Clear authentication cookie | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private (Token required) |
| `PATCH` | `/api/auth/profile` | Update name, phone, or password | Private (Token required) |

### Item Endpoints (`/api/items`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/items` | List items with search, filters, and pagination | Public |
| `GET` | `/api/items/:id` | Fetch complete item details with masked user info | Public |
| `POST` | `/api/items` | Create new Lost or Found item report | Private (Token required) |
| `PATCH` | `/api/items/:id` | Edit report details | Private (Owner only) |
| `DELETE` | `/api/items/:id` | Delete report and cascade contact requests | Private (Owner only) |
| `PATCH` | `/api/items/:id/resolve` | Toggle item status (`ACTIVE` ↔ `RESOLVED`) | Private (Owner only) |

### Dashboard & Analytics (`/api/dashboard`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Real-time portal & user statistics | Public / Enhanced |
| `GET` | `/api/dashboard/items` | List current user's submitted reports | Private (Token required) |

### Contact Requests (`/api/requests`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/requests` | Send inquiry / claim request for an item | Private (Token required) |
| `GET` | `/api/requests` | Fetch user's incoming and sent requests | Private (Token required) |
| `PATCH` | `/api/requests/:id` | Accept or reject claim inquiry | Private (Recipient only) |

### System Health
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime, timestamp, and database state | Public |

---

## 🧪 Automated Testing & Results

The backend includes automated integration tests using Jest and Supertest running against an in-memory database to test realistic conditions without modifying production data.

### To Run the Test Suite:
```bash
npm run test
```

### Actual Test Execution Output:
```text
PASS tests/api.test.js
  FindIt Backend API Test Suite
    GET /api/health
      √ should return 200 and healthy status (258 ms)
    Authentication Endpoints
      √ should register a new user successfully (991 ms)
      √ should reject registration with duplicate email (225 ms)
      √ should login an existing user and return token (626 ms)
      √ should reject login with wrong password (278 ms)
      √ should block access to /api/auth/me without token (26 ms)
    Item CRUD and Ownership Enforcement
      √ should allow authenticated User A to report a lost item (463 ms)
      √ should list items publicly with search and filter support (555 ms)
      √ SECURITY TEST: Prevent User B from editing User A item (393 ms)
      √ SECURITY TEST: Prevent User B from deleting User A item (489 ms)
      √ should allow Owner to mark item as RESOLVED (499 ms)
    Contact Request Workflow
      √ should allow User B to send a contact request to User A item and reject self-contact (506 ms)

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        39.057 s
```

---

## 🐙 GitHub Publishing Guide

To push this project to your GitHub account:

1. Create a new repository on [github.com/new](https://github.com/new) named:
   ```
   lost-and-found-portal
   ```
   *(Keep it Public, do not initialize with README since we have one).*
2. Open your terminal in the workspace root:
   ```bash
   git add .
   git commit -m "feat: complete full stack implementation of FindIt portal"
   git branch -M main
   git remote add origin https://github.com/<your-username>/lost-and-found-portal.git
   git push -u origin main
   ```
3. Your code is now published with all credentials safely protected by `.gitignore`!

---

## 🚀 Deployment Guide (Render & Vercel)

### Step 1: Deploy Backend to Render (Free Tier)
1. Go to [render.com](https://render.com) and create an account.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository `lost-and-found-portal`.
4. Fill in the service settings:
   - **Name**: `findit-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables under **Advanced**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `JWT_SECRET`: *A secure random string*
   - `CLIENT_URL`: *Your Vercel frontend URL (or update after deploying frontend)*
6. Click **Create Web Service**. Note your backend URL (e.g. `https://findit-backend.onrender.com`).

### Step 2: Deploy Frontend to Vercel (Free Tier)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** → **Project**.
3. Import `lost-and-found-portal`.
4. In the configuration:
   - **Root Directory**: Select `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://findit-backend.onrender.com/api`
6. Click **Deploy**.
7. Once deployed, copy your Vercel URL and add it as the `CLIENT_URL` in your Render backend settings so CORS allows requests.

---

## 🛡 Security & Privacy Features

1. **Password Protection**: Passwords are encrypted using `bcryptjs` with 10 salt rounds before storage. Plaintext passwords are never saved or returned.
2. **Dual Authentication Protection**: Uses JSON Web Tokens (JWT) stored in HttpOnly cookies, with authorization headers supported for cross-domain flexibility.
3. **Strict Ownership Enforcement**: Backend controllers verify `item.userId.toString() === req.user._id.toString()` before allowing edits, deletions, or status toggles. Users cannot alter others' reports.
4. **Rate Limiting**: Authentication endpoints are rate-limited with `express-rate-limit` to prevent brute force login attempts.
5. **NoSQL Injection Resistance**: Input values are strictly sanitized through Mongoose schema validation.
6. **Privacy-Preserving Contact**: Reporter email addresses are masked for public viewers (`a***a@college.edu`). Claimants initiate contact via the internal messaging workflow.

---

## 🎓 College Viva Explanation Guide

*Use this simple, confidence-building script to present the project to your evaluator:*

> **"Good morning/afternoon, Respected Evaluator.**
>
> Today, I am demonstrating **FindIt — Lost & Found Portal**, a full-stack web application developed to solve the problem of misplaced belongings in educational campuses and large communities.
>
> **The Architecture:**
> - The frontend is built with **React** and **Vite** for fast client-side rendering, styled with **Tailwind CSS** using a custom navy-and-teal design system.
> - The backend is powered by **Node.js** and **Express.js**, exposing a RESTful API following MVC architecture.
> - The database is **MongoDB** with **Mongoose ODM**, utilizing relational indexing and text search.
> - For authentication, we use **JWT (JSON Web Tokens)** with **bcrypt** password hashing and route guards.
>
> **Key User Flow:**
> 1. A student reports a lost or found item with location and category details.
> 2. Other students browse listings with real-time keyword search and category filters.
> 3. If someone discovers a match, they send a private **Contact Request** explaining their claim.
> 4. The reporter reviews the claim in their **Dashboard**, verifies the proof, and marks the report as **Resolved** upon returning the item.
>
> All features have been tested with automated test suites verifying security, CRUD operations, and ownership authorization."

---

## ❓ 10 Likely Viva Questions & Answers

### Q1: Why did you choose MongoDB instead of a relational database like MySQL?
**Answer**: "MongoDB is a document-oriented NoSQL database that stores data in flexible JSON-like documents. In a lost and found application, item attributes can vary significantly across categories (e.g. electronics vs keys vs books). MongoDB handles hierarchical data like nested contact requests and optional images efficiently and allows rapid schema evolution with Mongoose validation."

### Q2: How is user authentication implemented and secured?
**Answer**: "When a student registers or logs in, their password is encrypted using `bcryptjs` with salt rounds. On successful verification, the server generates a signed JSON Web Token (JWT) containing the user ID. This token is transmitted via an HttpOnly cookie and Bearer headers to protect against Cross-Site Scripting (XSS) attacks."

### Q3: What is the purpose of the `protect` middleware in Express?
**Answer**: "The `protect` middleware acts as a gatekeeper for private routes (such as creating reports, viewing dashboards, or responding to claims). It extracts the JWT from the request, verifies its cryptographic signature against our `JWT_SECRET`, retrieves the user record from MongoDB, and attaches it to `req.user`. If the token is missing or invalid, it returns a 401 Unauthorized status."

### Q4: How do you prevent one student from modifying or deleting another student's report?
**Answer**: "We enforce strict backend ownership checks. In the `updateItem` and `deleteItem` controllers, before any database modification occurs, the server compares the report creator's `userId` with the authenticated `req.user._id`. If they do not match, the server rejects the request with a 403 Forbidden status code."

### Q5: What is CORS and how did you configure it?
**Answer**: "CORS stands for Cross-Origin Resource Sharing. It is a browser security mechanism that restricts web pages from making API calls to a different domain or port. In FindIt, our Express backend configures the `cors` middleware with `credentials: true` and allows specific origins like `http://localhost:5173` in development and our production frontend URL."

### Q6: How does the search and filtering mechanism work?
**Answer**: "The backend `getItems` controller constructs a dynamic Mongoose query object based on URL query parameters (`search`, `category`, `type`, `status`). For text searches, we use case-insensitive regular expressions across title, description, and location fields, supported by MongoDB compound indexes for fast response times."

### Q7: What are React Context and Hooks, and where are they used in FindIt?
**Answer**: "`AuthContext` uses React Context to provide global authentication state (`user`, `login`, `logout`, `loading`) across all components without prop drilling. We use React Hooks like `useState` for local component state, `useEffect` for data fetching on component mount, and custom hooks like `useAuth` to access session data."

### Q8: What happens if an item doesn't have an image uploaded?
**Answer**: "FindIt implements a resilient visual fallback system. In `constants.js`, each category has a curated high-resolution illustration. The `ItemCard` component also includes an `onError` image handler that automatically switches to the category fallback if an external image link fails to load, preventing broken image icons."

### Q9: What are HTTP status codes and can you give examples used in this project?
**Answer**: "HTTP status codes communicate the outcome of an API request:
- `200 OK`: Successful retrieval or update.
- `201 Created`: Successful creation of a new user or item.
- `400 Bad Request`: Missing required fields or duplicate email.
- `401 Unauthorized`: Missing or invalid authentication token.
- `403 Forbidden`: Authenticated user attempting to modify another user's item.
- `404 Not Found`: Item or endpoint does not exist.
- `500 Internal Server Error`: Unexpected server exception."

### Q10: How do automated tests verify the application's correctness?
**Answer**: "We use Jest with Supertest to perform end-to-end API testing. Our test suite runs 12 automated test cases against an in-memory MongoDB instance. It tests the complete lifecycle: user registration, rejection of duplicate emails, login validation, token issuance, item creation, public search, ownership security checks, and contact claim submissions."

---

## 📄 License
This project was built for educational purposes as an individual college mini-project.
Open-source under the MIT License.
