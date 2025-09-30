# Warehouse Product Tracking API

## Description

This is a Warehouse Product Tracking API built for Verto using Node.js, Express.js, and MongoDB. The API allows for managing products in a warehouse, including tracking stock quantities, adding and removing stock, and monitoring low stock alerts based on configurable thresholds. It provides a RESTful interface for product management operations.

## Setup and Run Locally

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local installation or cloud instance like MongoDB Atlas)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd warehouse
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/warehouse
   PORT=5000
   ```
   Adjust `MONGO_URI` if using a different MongoDB setup.

4. Start the server:
   - For development (with auto-restart):
     ```
     npm run dev
     ```
   - For production:
     ```
     npm start
     ```

The API will be running on `http://localhost:5000` (or the port specified in `.env`).

## Running Test Cases

The project uses Jest for testing. To run the test cases:

```
npm test
```

This will execute all tests in the `tests/` directory, including tests for stock management (adding/removing stock) and low stock alerts. The tests use supertest to simulate HTTP requests and connect to a test database.

## Assumptions and Design Choices

- **Technology Stack**: Node.js with Express.js for the server, MongoDB with Mongoose for data modeling and storage.
- **API Design**: RESTful API with routes under `/api/products`. Includes standard CRUD operations for products, plus specific endpoints for stock management (`/add-stock`, `/remove-stock`) and low stock queries (`/low-stock`).
- **Security**: Implemented Helmet for security headers, CORS for cross-origin requests, and rate limiting to prevent abuse.
- **Data Validation**: Stock quantities and thresholds must be non-negative integers. Stock cannot be removed if insufficient quantity is available.
- **Low Stock Logic**: A virtual property `isLowStock` is used to determine if a product's stock is at or below the threshold.
- **Error Handling**: Centralized error handling middleware for consistent error responses.
- **Environment Configuration**: Uses dotenv for environment variables, with defaults for port.
- **Database**: Assumes MongoDB is available; connection is established on server start.
- **Testing**: Tests are isolated per describe block, with database cleanup after each test to ensure consistency.
