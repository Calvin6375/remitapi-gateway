import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import transactionRoutes from './routes/transaction.js';
import webhookRoutes from './routes/webhook.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Connect to Database
connectDB().catch((err) => {
  logger.error('Database connection failed:', err);
  process.exit(1);
});

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RemitAPI',
      version: '1.0.0',
      description: 'Mock remittance gateway API with multi-channel payment integration'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/webhooks', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  logger.info(\RemitAPI server running on port \\);
  logger.info(\Swagger docs available at http://localhost:\/api-docs\);
});

export default app;
