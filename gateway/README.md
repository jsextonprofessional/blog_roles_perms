# API Gateway

The API Gateway serves as the single entry point for all client requests to the blog application. It handles authentication, rate limiting, auditing, and routing to the appropriate backend services.

## Architecture

```
Client → Gateway → [Auth Service, Blog Service]
```

The gateway implements:
- **Authentication**: JWT token verification
- **Rate Limiting**: Prevents abuse (100 requests per minute per IP)
- **Audit Logging**: Tracks all requests with user context
- **Request Proxying**: Routes requests to appropriate microservices
- **Error Handling**: Centralized error handling

## Routes

### Authentication Routes (`/v1/auth`)
- `POST /v1/auth/register` - Register a new user
- `POST /v1/auth/login` - Login and receive JWT token
- `GET /v1/auth/me` - Get current user info (requires auth)
- `GET /v1/auth/admin-only` - Admin-only endpoint (requires auth + ADMIN role)

### Blog Routes (`/v1`)
All blog routes require authentication via JWT token in the `Authorization` header.

#### Articles
- `POST /v1/articles` - Create a new article
- `GET /v1/articles` - Get all articles
- `PATCH /v1/articles/:id` - Update an article
- `DELETE /v1/articles/:id` - Delete an article

#### Comments
- `POST /v1/articles/:articleId/comments` - Create a comment on an article
- `GET /v1/articles/:articleId/comments` - Get all comments for an article
- `PATCH /v1/comments/:id` - Update a comment
- `DELETE /v1/comments/:id` - Delete a comment

### Health Check
- `GET /health` - Returns gateway status

## Middleware

### 1. Rate Limiting (`rateLimitMiddleware`)
- Window: 60 seconds
- Max requests: 100 per IP
- Applied globally to all routes

### 2. Audit Logging (`auditMiddleware`)
- Logs every request with method, path, user ID, role, and timestamp
- Uses Pino logger for structured logging

### 3. Authentication (`authnMiddleware`)
- Verifies JWT tokens from `Authorization: Bearer <token>` header
- Extracts user information and attaches to `req.user`
- Optional authentication (continues if no token provided)
- Returns 401 for invalid tokens

### 4. Context Middleware (`contextMiddleware`)
- Passes user context to downstream services
- Adds `x-user-context` header with serialized user info

### 5. Error Handling (`errorMiddleware`)
- Catches and logs all errors
- Returns standardized error responses

## Configuration

Environment variables:

```bash
# Gateway Configuration
PORT=3000                                    # Gateway port
JWT_SECRET=your-secret-key                   # JWT signing secret

# Service URLs
BLOG_SERVICE_URL=http://localhost:4001       # Blog service URL
AUTHN_SERVICE_URL=http://localhost:4000      # Auth service URL
```

## Development

### Install Dependencies
```bash
pnpm install
```

### Run in Development Mode
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
```

### Run Tests
```bash
pnpm test
```

## Usage Examples

### Register a User
```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","role":"USER"}'
```

### Login
```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

### Create an Article (Authenticated)
```bash
curl -X POST http://localhost:3000/v1/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"My Article","content":"Article content here"}'
```

### Get All Articles (Authenticated)
```bash
curl http://localhost:3000/v1/articles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
gateway/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── index.ts            # Entry point
│   ├── config.ts           # Configuration management
│   ├── middleware/
│   │   ├── audit.ts        # Audit logging
│   │   ├── authn.ts        # Authentication
│   │   ├── context.ts      # User context propagation
│   │   ├── error.ts        # Error handling
│   │   └── rateLimit.ts    # Rate limiting
│   └── proxy/
│       ├── auth.proxy.ts   # Auth service proxy
│       └── blog.proxy.ts   # Blog service proxy
├── types/
│   └── express.d.ts        # Express type extensions
├── tests/
│   └── integration/        # Integration tests
├── package.json
├── tsconfig.json
└── README.md
```

## Dependencies

- **express**: Web framework
- **jsonwebtoken**: JWT token handling
- **node-fetch**: HTTP client for proxying requests
- **express-rate-limit**: Rate limiting middleware
- **pino**: Fast JSON logger
- **pino-http**: HTTP logger middleware

## Security Considerations

1. **JWT Secret**: Always use a strong, randomly generated secret in production
2. **Rate Limiting**: Prevents DDoS and brute force attacks
3. **HTTPS**: Use HTTPS in production (configure reverse proxy)
4. **CORS**: Configure CORS appropriately for your frontend domain
5. **Input Validation**: Validate all inputs before proxying to services

## Future Enhancements

- [ ] Add request/response transformation
- [ ] Implement circuit breaker pattern
- [ ] Add distributed tracing (OpenTelemetry)
- [ ] Implement caching layer (Redis)
- [ ] Add API versioning strategy
- [ ] Implement request validation with JSON schemas
- [ ] Add comprehensive integration tests
- [ ] Implement retry logic for failed service calls
- [ ] Add metrics collection (Prometheus)
- [ ] Implement API documentation (Swagger/OpenAPI)
