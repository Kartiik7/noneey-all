# Backend API Test Commands

## 🚀 Start the Server
```bash
cd backend
npm start
```

## 🔍 Test Suggestion System (Corrected Routes)

### 1. Submit a Suggestion (User)
```bash
curl -X POST http://localhost:5000/api/suggestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Recipe",
    "description": "A delicious test recipe",
    "ingredients": ["2 cups flour", "1 cup sugar", "3 eggs"],
    "steps": ["Mix ingredients", "Bake at 350°F for 30 minutes"],
    "authorName": "Test User",
    "email": "test@example.com"
  }'
```

### 2. Get All Pending Suggestions (Admin)
```bash
curl -X GET http://localhost:5000/api/suggestions \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### 3. Approve a Suggestion (Admin)
```bash
curl -X PATCH http://localhost:5000/api/suggestions/SUGGESTION_ID/approve \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### 4. Reject a Suggestion (Admin)
```bash
curl -X DELETE http://localhost:5000/api/suggestions/SUGGESTION_ID \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 🔐 Authentication Tests

### 1. User Registration
```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Admin Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

## 🍳 Recipe System Tests

### 1. Get All Recipes
```bash
curl -X GET http://localhost:5000/api/recipes
```

### 2. Create Recipe (Authenticated)
```bash
curl -X POST http://localhost:5000/api/recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "New Recipe",
    "description": "Recipe description",
    "ingredients": ["ingredient1", "ingredient2"],
    "steps": ["step1", "step2"]
  }'
```

### 3. Get Recipe by ID
```bash
curl -X GET http://localhost:5000/api/recipes/RECIPE_ID
```

## 🧪 Validation Tests

### 1. Test Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/suggestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "",
    "authorName": "",
    "email": ""
  }'
```

### 2. Test Invalid Email Format
```bash
curl -X POST http://localhost:5000/api/suggestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Recipe",
    "authorName": "Test User",
    "email": "invalid-email"
  }'
```

### 3. Test Unauthorized Access
```bash
curl -X GET http://localhost:5000/api/suggestions
```

## 📊 Database Connection Test
```bash
# Check if MongoDB is connected
curl -X GET http://localhost:5000/
```

## 🔄 Token Refresh Test
```bash
curl -X POST http://localhost:5000/api/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 📝 Environment Setup Check
```bash
# Check if .env file exists and has required variables
cd backend && ls -la .env

# Check if MongoDB URI is set
echo $MONGO_URI
```

## 🧪 Quick Test Script
Save this as `test-api.sh` and run:
```bash
#!/bin/bash
echo "Testing Backend API..."

# Start server in background
npm start &

# Wait for server to start
sleep 3

# Test server is running
curl -X GET http://localhost:5000/

# Test suggestion endpoint without auth (should fail)
curl -X POST http://localhost:5000/api/suggestions \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","authorName":"Test","email":"test@test.com"}'

echo "Tests completed!"
```

## 🐛 Debug Commands
```bash
# Check server logs
tail -f backend/server.log

# Check MongoDB connection
mongosh --eval "db.runCommand({ping: 1})"

# Check Node.js version
node --version

# Check npm packages
npm list
