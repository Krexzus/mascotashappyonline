# Design Document

## Overview

This design implements a private pet system where each user has their own authenticated session and personal pet. The system uses JWT tokens for authentication and modifies the existing MongoDB schema to associate pets with specific users. The design ensures complete data isolation between users while maintaining the existing Pou-style pet mechanics.

## Architecture

### Authentication Flow
```
User Registration/Login → JWT Token Generation → Token Validation Middleware → User-Specific Pet Access
```

### Data Flow
```
Client Request → Auth Middleware → User Identification → Pet Data Filtering → Response
```

### Database Schema Changes
- Add User collection for authentication
- Modify Pet collection to include userId field
- Maintain existing pet mechanics (hunger, happiness, degradation)

## Components and Interfaces

### 1. Authentication System

**User Model (userModel.js)**
```javascript
{
  id: Number (unique),
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  lastLogin: Date
}
```

**Authentication Service (authService.js)**
- User registration with password hashing
- User login with JWT token generation
- Token validation and user identification
- Password security using bcrypt

**Authentication Controller (authController.js)**
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/auth/profile - Get user profile

### 2. Authorization Middleware

**Auth Middleware (authMiddleware.js)**
- Validates JWT tokens from request headers
- Extracts user information from token
- Attaches user data to request object
- Handles token expiration and invalid tokens

### 3. Modified Pet System

**Updated Pet Model**
```javascript
{
  id: Number (unique),
  userId: Number (required, references User.id),
  nombre: String,
  tipo: String,
  superpoder: String,
  // ... existing pet fields
}
```

**Updated Pet Service**
- Filter all pet operations by userId
- Automatic pet creation for new users
- User-specific pet degradation
- Isolated pet statistics and actions

**Updated Pet Controller**
- All endpoints require authentication
- Pet operations filtered by authenticated user
- No access to other users' pets

### 4. Security Considerations

**JWT Configuration**
- Secret key stored in environment variables
- Token expiration: 24 hours
- Refresh token mechanism (optional)

**Password Security**
- bcrypt hashing with salt rounds: 12
- Password strength validation
- Rate limiting for login attempts

## Data Models

### User Schema
```javascript
const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});
```

### Modified Pet Schema
```javascript
const petSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true }, // NEW FIELD
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  superpoder: { type: String, required: true },
  // ... existing fields remain the same
});
```

### Hero Schema Update
```javascript
// Remove petId field or make it user-specific
const heroSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true }, // NEW FIELD
  name: { type: String, required: true },
  alias: { type: String, required: true },
  city: { type: String, required: true },
  team: { type: String, required: true },
  petId: { type: Number, default: null } // Now references user's own pet
});
```

## Error Handling

### Authentication Errors
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Valid token but insufficient permissions
- 409 Conflict: Username/email already exists during registration
- 400 Bad Request: Invalid login credentials

### Pet Access Errors
- 404 Not Found: Pet doesn't exist for the authenticated user
- 403 Forbidden: Attempting to access another user's pet
- 401 Unauthorized: No authentication token provided

### Database Errors
- Connection failures with retry logic
- Data validation errors
- Duplicate key errors for usernames/emails

## Testing Strategy

### Unit Tests
- Authentication service functions
- Password hashing and validation
- JWT token generation and validation
- Pet filtering by userId

### Integration Tests
- Complete authentication flow
- Pet CRUD operations with authentication
- Cross-user access prevention
- Token expiration handling

### API Tests (Postman Collection)
- User registration and login flows
- Authenticated pet operations
- Unauthorized access attempts
- Token refresh scenarios

## Deployment Considerations (Render)

### Environment Variables
```
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string
NODE_ENV=production
PORT=3001
```

### Build Configuration
- Ensure all dependencies are in package.json
- Set up proper start script
- Configure CORS for production domains

### Security Headers
- Implement helmet.js for security headers
- Configure CORS for specific origins in production
- Rate limiting for authentication endpoints

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/profile
```

### Protected Pet Endpoints (require authentication)
```
GET /api/pets/my-pet - Get user's pet
POST /api/pets/my-pet - Create user's pet
PUT /api/pets/my-pet - Update user's pet
POST /api/pets/my-pet/feed - Feed user's pet
POST /api/pets/my-pet/water - Give water to user's pet
POST /api/pets/my-pet/exercise - Exercise user's pet
GET /api/pets/my-pet/status - Get user's pet status
```

### Protected Hero Endpoints
```
GET /api/heroes/my-heroes - Get user's heroes
POST /api/heroes - Create hero for user
PUT /api/heroes/:id - Update user's hero
DELETE /api/heroes/:id - Delete user's hero
```

## Migration Strategy

1. **Phase 1**: Add authentication system without breaking existing functionality
2. **Phase 2**: Add userId fields to existing collections
3. **Phase 3**: Migrate existing data to assign to default user or require re-creation
4. **Phase 4**: Enforce authentication on all pet endpoints
5. **Phase 5**: Remove or deprecate old endpoints that don't require authentication