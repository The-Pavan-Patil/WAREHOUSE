
import { request } from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import Product from '../models/Product.js';


const MONGO_URI = process.env.MONGO_URI;

beforeAll(async () => {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  await Product.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Stock Management', () => {
  let productId;

  beforeEach(async () => {
    const product = new Product({
      name: 'Test Product',
      description: 'Test Description',
      stock_quantity: 10,
      low_stock_threshold: 5
    });
    const saved = await product.save();
    productId = saved._id;
  });

  describe('Add Stock', () => {
    test('should add stock successfully', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}/add-stock`)
        .send({ quantity: 5 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.currentStock).toBe(15);
      expect(response.body.data.quantityAdded).toBe(5);
    });

    test('should reject negative quantity', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}/add-stock`)
        .send({ quantity: -5 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('positive number');
    });
  });

  describe('Remove Stock', () => {
    test('should remove stock successfully', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}/remove-stock`)
        .send({ quantity: 3 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.currentStock).toBe(7);
      expect(response.body.data.quantityRemoved).toBe(3);
    });

    test('should reject insufficient stock removal', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}/remove-stock`)
        .send({ quantity: 15 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Insufficient stock');
    });

    test('should not allow stock to go below zero', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}/remove-stock`)
        .send({ quantity: 11 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Insufficient stock.*Available: 10.*Requested: 11/);
    });
  });
});

describe('Low Stock Products', () => {
  test('should return products below threshold', async () => {
    
    await Product.create([
      { name: 'Low Stock Product 1', description: 'Test', stock_quantity: 2, low_stock_threshold: 5 },
      { name: 'Normal Stock Product', description: 'Test', stock_quantity: 10, low_stock_threshold: 5 },
      { name: 'Low Stock Product 2', description: 'Test', stock_quantity: 5, low_stock_threshold: 5 }
    ]);

    const response = await request(app)
      .get('/api/products/low-stock')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(2);
    expect(response.body.data).toHaveLength(2);
  });
});
