# RemitAPI

A production-ready Node.js + Express backend demonstrating secure API integration across multiple payment channels for cross-border remittance transfers.

## 🎯 Overview

RemitAPI is a mock remittance gateway showcasing fintech best practices including:
- Multi-channel payment integration (M-Pesa, Stripe, Binance Pay)
- KYC verification workflow
- AES-256 encryption for sensitive transaction data
- JWT-based authentication
- Webhook event handling
- Comprehensive API documentation with Swagger

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or cloud)
- npm or yarn

### Installation

\\\ash
# Clone repository
git clone <repo-url>
cd remitapi

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
# MONGODB_URI, JWT_SECRET, ENCRYPTION_KEY, etc.

# Start server
npm start

# Development mode with auto-reload
npm run dev
\\\

### Verify Installation

\\\ash
# Check health endpoint
curl http://localhost:3000/health

# Access Swagger documentation
open http://localhost:3000/api-docs
\\\

## 📦 Project Structure

\\\
remitapi/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.js      # MongoDB connection
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   └── transactionController.js
│   ├── middleware/          # Express middleware
│   │   ├── authenticate.js  # JWT verification
│   │   └── errorHandler.js  # Global error handling
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/              # API route definitions
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── transaction.js
│   │   └── webhook.js
│   ├── services/            # Business logic
│   │   ├── authService.js
│   │   └── transactionService.js
│   ├── utils/               # Utility functions
│   │   ├── encryption.js    # AES-256 encryption
│   │   ├── jwt.js           # JWT token management
│   │   └── logger.js        # Winston logger
│   └── index.js             # Application entry point
├── tests/                   # Unit tests
├── .env.example            # Environment template
├── jest.config.js          # Jest configuration
├── package.json            # Dependencies
└── README.md               # This file
\\\

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

\\\ash
curl -H "Authorization: Bearer your_jwt_token" \\
  http://localhost:3000/api/users/profile
\\\

## 📚 API Endpoints

### Authentication

#### Register User
\\\ash
POST /api/auth/register

{
  "email": "user@example.com",
  "password": "secure_password_8_chars_min",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "country": "US",
  "idNumber": "ID123456"
}

Response:
{
  "message": "User registered successfully",
  "data": {
    "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "email": "user@example.com",
    "kycStatus": "pending"
  }
}
\\\

#### Login
\\\ash
POST /api/auth/login

{
  "email": "user@example.com",
  "password": "secure_password_8_chars_min"
}

Response:
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
\\\

### User Profile

#### Get Profile
\\\ash
GET /api/users/profile
Authorization: Bearer <token>

Response:
{
  "message": "Profile retrieved",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "country": "US",
    "kycStatus": "verified",
    "accountBalance": 5000,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
\\\

### Transactions

#### Send Money
\\\ash
POST /api/transactions/send
Authorization: Bearer <token>

{
  "amount": 100,
  "currency": "USD",
  "channel": "mpesa",
  "recipientPhone": "+254712345678",
  "recipientName": "Jane Smith",
  "webhookUrl": "https://yourapp.com/webhook/transaction"
}

Response:
{
  "message": "Transaction initiated",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "transactionId": "TXN-1705315200000-a1b2c3d4e",
    "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "amount": 100,
    "channel": "mpesa",
    "status": "pending",
    "createdAt": "2024-01-15T10:40:00Z"
  }
}
\\\

#### Get Transaction History
\\\ash
GET /api/transactions/history
Authorization: Bearer <token>

Response:
{
  "message": "Transaction history retrieved",
  "data": [
    {
      "transactionId": "TXN-1705315200000-a1b2c3d4e",
      "amount": 100,
      "channel": "mpesa",
      "status": "completed",
      "createdAt": "2024-01-15T10:40:00Z"
    }
  ]
}
\\\

#### Get Transaction Details
\\\ash
GET /api/transactions/{transactionId}
Authorization: Bearer <token>
\\\

### Webhooks

#### Handle Transaction Confirmation
\\\ash
POST /api/webhooks/confirm

{
  "transactionId": "TXN-1705315200000-a1b2c3d4e",
  "status": "completed",
  "confirmationCode": "CONFIRM-123456"
}

Response:
{
  "message": "Webhook processed",
  "transactionId": "TXN-1705315200000-a1b2c3d4e"
}
\\\

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **AES-256 Encryption**: Sensitive data encrypted at rest
- **Error Handling**: Comprehensive error handling middleware
- **Input Validation**: Schema validation with Mongoose
- **CORS & Rate Limiting**: Ready for production integration

## 📊 Database Schema

### User
- email (unique)
- password (hashed)
- firstName, lastName
- phone, country
- idNumber (unique)
- kycStatus: pending | verified | rejected
- accountBalance
- timestamps

### Transaction
- transactionId (unique)
- userId (reference)
- amount, currency
- channel: mpesa | stripe | binance_pay
- status: pending | processing | completed | failed
- encryptedData (AES-256)
- webhookUrl
- metadata
- timestamps

## 🧪 Testing

\\\ash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Watch mode for development
npm run test:watch
\\\

## 📖 API Documentation

Swagger documentation is automatically generated and available at:
- **URL**: http://localhost:3000/api-docs
- **Generated from**: JSDoc comments in route files
- **OpenAPI Version**: 3.0.0

## 🛠️ Configuration

### Environment Variables

\\\env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/remitapi
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=24h
ENCRYPTION_KEY=your-32-byte-key
LOG_LEVEL=info
\\\

## 🚀 Deployment

### Docker (if applicable)
\\\ash
docker build -t remitapi .
docker run -p 3000:3000 --env-file .env remitapi
\\\

### Cloud Deployment
- Set environment variables in your cloud platform
- Use MongoDB Atlas for database
- Deploy to Heroku, AWS, Google Cloud, or Vercel

## 📝 Scripts

- \
pm start\ - Start production server
- \
pm run dev\ - Start development server with auto-reload
- \
pm test\ - Run test suite
- \
pm run lint\ - Run ESLint
- \
pm run seed\ - Seed database with example data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## 📄 License

MIT

## 📧 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ using Node.js, Express, and MongoDB**
