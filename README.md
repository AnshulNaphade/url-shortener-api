# URL Shortener API

A production-grade REST API for URL shortening with user authentication, click analytics, and Docker deployment.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **URL Shortening**: Generate short, unique codes for long URLs
- **Click Tracking**: Track every click with timestamp and user agent
- **Analytics**: View detailed statistics for each shortened URL
- **Dockerized**: One-command setup with Docker Compose

## 🛠️ Tech Stack

- **Node.js** + **Express**: RESTful API framework
- **PostgreSQL**: Relational database for data persistence
- **Prisma ORM**: Type-safe database queries and migrations
- **JWT**: Secure token-based authentication
- **bcrypt**: Password hashing
- **Docker**: Containerized deployment

## 📦 Installation & Setup

### Prerequisites
- Docker Desktop installed
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/AnshulNaphade/url-shortener-api.git
cd url-shortener-api
```

2. **Start the application**
```bash
docker-compose up --build
```

That's it! The API will be running at `http://localhost:3000`

## 🔌 API Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response**: Returns a JWT token

### URL Operations (Requires Authentication)

All URL endpoints require `Authorization: Bearer <token>` header.

#### Create Short URL
```http
POST /urls
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "longUrl": "https://www.example.com/very/long/url"
}
```

**Response**:
```json
{
  "message": "Short URL created",
  "shortUrl": "http://localhost:3000/abc123",
  "shortCode": "abc123",
  "longUrl": "https://www.example.com/very/long/url"
}
```

#### List Your URLs
```http
GET /urls
Authorization: Bearer <your-jwt-token>
```

#### View Analytics
```http
GET /urls/:shortCode/analytics
Authorization: Bearer <your-jwt-token>
```

**Response**:
```json
{
  "shortCode": "abc123",
  "longUrl": "https://www.example.com",
  "totalClicks": 42,
  "createdAt": "2026-03-04T14:45:45.426Z",
  "recentClicks": [...]
}
```

### Public Endpoints

#### Redirect (No Authentication Required)
```http
GET /:shortCode
```

Redirects to the original long URL and tracks the click.

## 🗄️ Database Schema
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  urls      Url[]
  createdAt DateTime @default(now())
}

model Url {
  id        String   @id @default(cuid())
  longUrl   String
  shortCode String   @unique
  userId    String
  user      User     @relation(...)
  clicks    Click[]
  createdAt DateTime @default(now())
}

model Click {
  id        String   @id @default(cuid())
  urlId     String
  url       Url      @relation(...)
  userAgent String?
  clickedAt DateTime @default(now())
}
```

## 🧪 Testing the API

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Create short URL:**
```bash
curl -X POST http://localhost:3000/urls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"longUrl":"https://github.com"}'
```

## 🔧 Development

### Local Development (Without Docker)

1. Install dependencies:
```bash
npm install
```

2. Start PostgreSQL:
```bash
docker-compose up db -d
```

3. Set up environment variables in `.env`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/urlshortener?schema=public"
JWT_SECRET="your-secret-key"
PORT=3000
BASE_URL="http://localhost:3000"
```

4. Run migrations:
```bash
npx prisma migrate dev
```

5. Start development server:
```bash
npm run dev
```

## 📝 Project Structure
```
url-shortener-api/
├── src/
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── urlController.js     # URL operations
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── utils/
│   │   └── prisma.js            # Prisma client instance
│   └── index.js                 # Express app & routes
├── prisma/
│   └── schema.prisma            # Database schema
├── docker-compose.yml           # Docker services
├── Dockerfile                   # API container image
└── package.json
```

## 🚀 Deployment

This application is Docker-ready and can be deployed to any cloud platform that supports containers:

- **Railway**: Connect your GitHub repo, Railway auto-deploys
- **Render**: One-click deploy from Docker Compose
- **AWS ECS / Google Cloud Run**: Deploy the Docker image

## 🔐 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- Environment variables for sensitive data
- SQL injection prevention via Prisma ORM

## 📄 License

MIT

## 👤 Author

**Anshul Naphade**
- GitHub: [@AnshulNaphade](https://github.com/AnshulNaphade)

---

Built as part of placement preparation to demonstrate backend development skills with Node.js, PostgreSQL, and Docker.