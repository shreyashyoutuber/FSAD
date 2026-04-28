# BharatHome Value — Full Stack Project

A full-stack property valuation and interior renovation estimation platform built for the Indian real estate market.

---

## 🏠 What is BharatHome Value?

BharatHome Value helps homeowners in India estimate:
- Current **property market value**
- **Interior renovation costs** (Kitchen, Wardrobe, Full Home)
- Get **AI-powered renovation recommendations** with ROI projections

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, React Router, Chart.js |
| Backend | Spring Boot 3.4 (Java 17) |
| Database | MySQL (Aiven Cloud) |
| Auth | JWT + Google OAuth2 |
| Email | Brevo (Transactional Email API) |
| Deployment | Vercel (Frontend) + Render (Backend) |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL (local or cloud)

---

### Frontend Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd GITHUB_PUSH

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL=http://localhost:8080/api

# 4. Start the dev server
npm run dev
```

---

### Backend Setup

```bash
# Navigate to backend folder
cd Database/demo

# Set environment variables (create application-local.properties or set in your IDE):
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/bharathome_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=yourpassword
BREVO_API_KEY=your_brevo_api_key
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@bharathomevalue.com
ADMIN_PASSWORD=YourAdminPassword
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Run the backend
mvn spring-boot:run
```

---

## 🔐 Environment Variables

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |

### Backend (Render / application.properties)
| Variable | Description |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | MySQL connection string |
| `SPRING_DATASOURCE_USERNAME` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | DB password |
| `BREVO_API_KEY` | Brevo email service API key |
| `FRONTEND_URL` | Frontend URL (for email links) |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret |
| `JWT_SECRET` | Secret key for JWT signing |

---

## 🌐 Deployment

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set `VITE_API_BASE_URL` in Vercel → Settings → Environment Variables
3. Deploy with `npm run build`

### Backend (Render)
1. Connect your GitHub repo to Render
2. Set all backend environment variables in Render → Environment
3. Use the `Dockerfile` or set build command to `mvn package -DskipTests`

---

## 📁 Project Structure

```
GITHUB_PUSH/
├── src/                          # React Frontend
│   ├── components/
│   │   ├── PrivateRoute.jsx      # User route guard
│   │   ├── AdminRoute.jsx        # Admin route guard
│   │   └── Toast.jsx             # Toast notification system
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx            # Multi-step OTP registration
│   │   ├── AdminLogin.jsx        # Real backend admin auth
│   │   ├── AdminDashboard.jsx    # Admin panel with pagination
│   │   ├── UserDashboard.jsx     # User dashboard with charts
│   │   ├── NotFound.jsx          # 404 page
│   │   ├── TermsAndConditions.jsx
│   │   └── PrivacyPolicy.jsx
│   └── api.js                    # Centralized API layer
├── Database/demo/                # Spring Boot Backend
│   └── src/main/java/com/bharathome/database/
│       ├── controller/           # REST controllers
│       ├── model/                # JPA entities
│       ├── repository/           # Spring Data repositories
│       ├── security/             # JWT, OAuth2, SecurityConfig
│       └── service/              # Business logic, Email service
└── .env.example                  # Environment variable template
```

---

## 🔒 Security Features

- **JWT Authentication** — All protected routes require a valid token
- **BCrypt Password Hashing** — Passwords are never stored in plaintext
- **Email OTP Verification** — Required during registration
- **Admin Backend Auth** — Admin login validated against server-side credentials
- **Protected Routes** — Frontend guards prevent unauthorized access
- **CORS** — Configured for specific allowed origins only

---

## 📧 Email Flows

1. **OTP Email** — Sent during signup for email verification
2. **Welcome Email** — Sent after registration with secure auto-generated password
3. **Password Reset Email** — Sent when user requests forgot password

---

## 📝 License

© 2026 BharatHome Value. All rights reserved.
