# Brainchit Utils - Project Analysis & Explanation

## 1. Project Overview
**Brainchit Utils** is a Node.js/Express backend service designed as a utility API. currently, its primary function is to serve as a **Nutrition Tracker** backend, allowing authorized clients to store and retrieve daily nutritional data (calories, protein, fats, carbs).

The project is built to be scalable, using a modular structure (models, routes, controllers/handlers) and includes API documentation via Swagger.

## 2. Technology Stack
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (via Mongoose ODM)
*   **Documentation**: Swagger / OpenAPI (`swagger-jsdoc`, `swagger-ui-express`)
*   **Environment**: `dotenv` for configuration management
*   **Deployment/Process Management**: `nodemon` (for dev), likely standard node start for production.

---

## 3. Architecture & Code Flow (Top to Bottom)

The application follows a standard **MVC-like (Model-View-Controller)** pattern, although the "View" is replaced by JSON API responses.

### A. Entry Point: `server.js`
This is the heart of the application. When you run `npm start` (or `node server.js`), the following happens:
1.  **Environment Setup**: `require('dotenv').config()` loads variables (like `PORT`, `MONGO_URI`, `MASTER_KEY`) from `.env`.
2.  **Database Connection**: `connectDB()` is called from `config/database.js`. This establishes the connection to your MongoDB instance.
3.  **Middleware Setup**:
    *   `express.json()` and `express.urlencoded()` are enabled to parse incoming JSON bodies and URL-encoded data.
    *   **Swagger UI**: The API documentation is served at `/api-docs`.
4.  **Route Mounting**:
    *   `app.get('/')`: A simple welcome route to verify the server is running.
    *   `app.use('/api/health', healthRoutes)`: Registers the **Health/Nutrition** routes under the `/api/health` prefix.
5.  **Global Error Handling**: A catch-all middleware logs errors and sends a standard 500 JSON response to the client.
6.  **Server Start**: `app.listen(PORT)` starts the HTTP server.

### B. Configuration (`config/`)
*   **`database.js`**: Handles the Mongoose connection logic. It likely includes retry logic or connection logging.
*   **`swagger.js`**: Defines the OpenAPI specification (metadata about the API, version, title) and points to the files containing JSDoc annotations (in `routes/` and `server.js`).

### C. Middleware (`middleware/`)
*   **`auth.js` (`authenticateKey`)**: This is the security gatekeeper.
    *   It looks for a key in the request headers: `x-master-key` or `authorization`.
    *   It compares this value strictly against `process.env.MASTER_KEY`.
    *   **If valid**: `next()` is called, allowing the request to proceed to the route handler.
    *   **If invalid/missing**: Returns `401 Unauthorized` or `403 Forbidden`.

### D. Data Models (`models/`)
*   **`NutritionData.js`**: Defines the structure of the data in MongoDB.
    *   **Fields**:
        *   `totalCalorie` (Number, Required, Min 0)
        *   `totalProtien` (Number, Required, Min 0)
        *   `totalFats` (Number, Optional)
        *   `totalCarbs` (Number, Optional)
    *   **Options**: `timestamps: true` automatically adds `createdAt` and `updatedAt` fields to every document, which is crucial for tracking *daily* nutrition.

### E. API Routes (`routes/`)
Currently, the main logic resides in `routes/health.js`.

#### 1. POST `/api/health/nutrition`
**Goal**: Store a new nutrition entry.
**Flow**:
1.  **Auth Check**: `authenticateKey` middleware verifies the requester.
2.  **Destructuring**: Extracts `totalCalorie`, `totalProtien`, `totalFats`, `totalCarbs` from `req.body`.
3.  **Validation**: Manual checks ensure `totalCalorie` and `totalProtien` are present. (Mongoose would also catch this, but explicit checks provide clearer 400 errors).
4.  **Object Creation**: A new `NutritionData` instance is created.
5.  **Persistence**: `await nutritionData.save()` writes the document to MongoDB.
6.  **Response**: Returns `201 Created` with the saved data.

#### 2. GET `/api/health/nutrition`
**Goal**: Retrieve history.
**Flow**:
1.  **Auth Check**: `authenticateKey` verifies the requester.
2.  **Query**: `NutritionData.find().sort({ createdAt: -1 })` fetches all records, creating a historical timeline with the newest entries first.
3.  **Response**: Returns `200 OK` with the count and the array of data.

---

## 4. Summary of "What TF is Happening"
In short:
1.  The server wakes up and connects to the database.
2.  it sits waiting for requests on port 7000 (default).
3.  When a request hits `/api/health/nutrition`, the server first checks if you have the secret password (`MASTER_KEY`).
4.  If you do, it either **saves** your macro-nutrient stats to the database or **fetches** your history for you.
5.  If anything crashes, the global error handler catches it and tells you "Something went wrong" so the server doesn't die.
