# Brainchit Utils API

A Node.js utility server with MongoDB for data management. Includes authentication and Swagger documentation.

## Quick Start

### 1. Install & Setup

```bash
npm install
```

### 2. Start MongoDB

```bash
docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:latest
```

### 3. Configure `.env`

```env
PORT=7000
MASTER_KEY=your-super-secret-master-key-change-this
MONGODB_URI=mongodb://localhost:27017/brainchit_utils
```

**Important:** Change the `MASTER_KEY` before using in production.

### 4. Run Server

```bash
npm start
```

Server runs on: http://localhost:7000
API Docs: http://localhost:7000/api-docs

## Using the API

### Authentication

All endpoints require authentication. Add this header to your requests:

```
x-master-key: your-super-secret-master-key-change-this
```

### Example: Store Nutrition Data

```bash
curl -X POST http://localhost:7000/api/health/nutrition \
  -H "Content-Type: application/json" \
  -H "x-master-key: your-super-secret-master-key-change-this" \
  -d '{
    "totalCalorie": 2000,
    "totalProtien": 150,
    "totalFats": 60,
    "totalCarbs": 250
  }'
```

### Example: Get All Data

```bash
curl http://localhost:7000/api/health/nutrition \
  -H "x-master-key: your-super-secret-master-key-change-this"
```

### Use Swagger UI (Easier)

Open http://localhost:7000/api-docs in your browser:
1. Click **Authorize**
2. Enter your master key
3. Test any endpoint with **Try it out**

## Available Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | API info | No |
| GET | `/api-docs` | Swagger documentation | No |
| POST | `/api/health/nutrition` | Store nutrition data | Yes |
| GET | `/api/health/nutrition` | Get all nutrition data | Yes |

## Project Structure

```
.
├── config/
│   ├── database.js          # MongoDB connection
│   └── swagger.js           # API documentation config
├── middleware/
│   └── auth.js              # Authentication
├── models/
│   └── NutritionData.js     # Data schemas
├── routes/
│   └── health.js            # API routes
├── .env                     # Configuration (not in git)
├── package.json
├── server.js                # Main file
└── README.md
```

## Adding New Endpoints

1. Create a model in `models/` (if storing data)
2. Create a route file in `routes/`
3. Add Swagger docs in route file:
   ```javascript
   /**
    * @swagger
    * /api/your-endpoint:
    *   post:
    *     summary: Endpoint description
    *     tags: [Your Tag]
    *     security:
    *       - MasterKeyAuth: []
    */
   ```
4. Register route in `server.js`:
   ```javascript
   const yourRoutes = require('./routes/your-route');
   app.use('/api/your-path', yourRoutes);
   ```

## Common Issues

### MongoDB won't connect
```bash
# Check if running
docker ps | grep mongodb

# Start if stopped
docker start mongodb
```

### Port 7000 already in use
```bash
# Kill the process
lsof -ti:7000 | xargs kill -9

# Or change PORT in .env
```

### Authentication fails
- Check `MASTER_KEY` in `.env` matches your request header
- Make sure header name is exactly `x-master-key`

## Scripts

```bash
npm start      # Run server
npm run dev    # Run with auto-restart (needs nodemon)
```

## MongoDB Management

```bash
# Start MongoDB
docker start mongodb

# Stop MongoDB
docker stop mongodb

# View logs
docker logs mongodb

# Remove container (data persists)
docker rm mongodb

# Delete all data (warning: permanent)
docker volume rm mongodb_data
```

## Tech Used

- Node.js + Express
- MongoDB + Mongoose
- Swagger (API docs)
- Docker (for MongoDB)

## Deployment

Auto-deployment to server via GitHub Actions when pushing to `main` branch.

**Setup:** See [DEPLOY.md](DEPLOY.md) for complete deployment instructions.

**Quick summary:**
1. Configure GitHub Secrets (SSH credentials)
2. Setup server with PM2
3. Push to `main` branch → auto-deploys

## License

ISC
