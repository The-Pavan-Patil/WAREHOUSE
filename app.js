
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import errorHandler from './middleware/errorHandlers.js';
import productsRouter from './routes/products.js';

const app = express();


app.use(helmet());
app.use(cors());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use(limiter);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));


app.use('/api/products', productsRouter);


app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});


app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;
