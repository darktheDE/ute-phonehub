# ADMIN CREDENTIALS - Module 02 Testing

## Admin Accounts

### Account 1 (Recommended for testing)
**Email:** `testadmin@test.com`  
**Password:** `Test@123`  
**Role:** `ADMIN`  
**Status:** ✅ WORKING

### Account 2 (Alternative)
**Email:** `admin@utephonehub.com`  
**Password:** `Admin@123`  
**Role:** `ADMIN`  
**Status:** ⚠️ Password may need reset

---

## How to Test APIs with Swagger

### Step 1: Login to get Access Token
1. Open Swagger UI: http://localhost:8081/swagger-ui/index.html
2. Find **Auth Controller** → **POST /api/v1/auth/login**
3. Click "Try it out"
4. Input:
```json
{
  "usernameOrEmail": "testadmin@test.com",
  "password": "Test@123"
}
```
5. Click **Execute**
6. Copy `accessToken` from response

### Step 2: Authorize in Swagger
1. Click **Authorize** button (top right, lock icon)
2. Paste token in format: `Bearer <your-token-here>`
3. Click **Authorize**, then **Close**

### Step 3: Test APIs
Now you can test all ADMIN endpoints:
- GET /api/v1/products/admin/all
- POST /api/v1/products
- PUT /api/v1/products/{id}
- DELETE /api/v1/products/{id}
- POST /api/v1/products/{id}/restore
- POST /api/v1/products/{id}/images
- DELETE /api/v1/products/{id}/images/{imageId}

---

## PowerShell Quick Test Script

```powershell
# Login and save token
$loginBody = '{"usernameOrEmail":"testadmin@test.com","password":"Test@123"}'
$response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$global:token = $response.data.accessToken
Write-Host "Login Success! Token: $($token.Substring(0,30))..." -ForegroundColor Green

# Use token for API calls
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Example: Get all products
Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/admin/all?page=0&size=10" -Method GET -Headers $headers
```

---

## Notes

- **Token expiration:** Tokens expire after 1 hour. Re-login if you get 401 Unauthorized.
- **401 Error:** Token expired or invalid. Re-login to get new token.
- **403 Error:** You don't have ADMIN role. Make sure you login with admin account.
- **500 Error:** Server error. Check Docker Desktop → Containers → utephonehub-backend → Logs.
- **Frontend login (localhost:3000) ≠ Swagger login:** They are separate. Use Swagger's Authorize for API testing.

---

## Database Info

- **PostgreSQL:** localhost:5432
- **Database:** utephonehub
- **Username:** postgres
- **Password:** postgres

---

## Useful Docker Commands

```bash
# View backend logs
docker logs utephonehub-backend --tail 100

# Restart backend
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build backend

# Stop all containers
docker-compose down

# Start all containers
docker-compose up -d
```
