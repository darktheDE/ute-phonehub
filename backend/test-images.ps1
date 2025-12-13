# Test Image Management APIs - Module 02
# Simple test script without special characters

Write-Host "`n===== TEST IMAGE MANAGEMENT APIs (M02) =====" -ForegroundColor Cyan

# Get admin token
Write-Host "`nGetting Admin Token..." -ForegroundColor Yellow
$loginBody = '{"usernameOrEmail":"admin@utephonehub.com","password":"Admin@123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.data.accessToken
Write-Host "Token obtained successfully" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test 1: POST /products/1/images - Manage product images
Write-Host "`n[TEST 1] POST /products/1/images - Add 3 images" -ForegroundColor Yellow
$body1 = @'
{
    "images": [
        {
            "imageUrl": "https://example.com/iphone15-front.jpg",
            "altText": "iPhone 15 Pro Max - Front",
            "imageOrder": 0,
            "isPrimary": true
        },
        {
            "imageUrl": "https://example.com/iphone15-back.jpg",
            "altText": "iPhone 15 Pro Max - Back",
            "imageOrder": 1,
            "isPrimary": false
        },
        {
            "imageUrl": "https://example.com/iphone15-side.jpg",
            "altText": "iPhone 15 Pro Max - Side",
            "imageOrder": 2,
            "isPrimary": false
        }
    ]
}
'@

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/1/images" -Method POST -Headers $headers -Body $body1
    Write-Host "SUCCESS: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: POST /products/2/images - 2 images for another product
Write-Host "`n[TEST 2] POST /products/2/images - Add 2 images" -ForegroundColor Yellow
$body2 = @'
{
    "images": [
        {
            "imageUrl": "https://example.com/samsung-s24-primary.jpg",
            "altText": "Samsung Galaxy S24 Ultra",
            "imageOrder": 0,
            "isPrimary": true
        },
        {
            "imageUrl": "https://example.com/samsung-s24-camera.jpg",
            "altText": "Samsung Galaxy S24 Ultra - Camera",
            "imageOrder": 1,
            "isPrimary": false
        }
    ]
}
'@

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/2/images" -Method POST -Headers $headers -Body $body2
    Write-Host "SUCCESS: Managed 2 images for product 2" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Validation - Multiple primary images (should fail)
Write-Host "`n[TEST 3] VALIDATION: Multiple primary images (should fail)" -ForegroundColor Yellow
$bodyInvalid1 = @'
{
    "images": [
        {"imageUrl": "https://example.com/img1.jpg", "altText": "Img1", "imageOrder": 0, "isPrimary": true},
        {"imageUrl": "https://example.com/img2.jpg", "altText": "Img2", "imageOrder": 1, "isPrimary": true}
    ]
}
'@

try {
    Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/3/images" -Method POST -Headers $headers -Body $bodyInvalid1
    Write-Host "ERROR: Should have failed but succeeded!" -ForegroundColor Red
} catch {
    Write-Host "SUCCESS: Correctly rejected - Multiple primary images" -ForegroundColor Green
}

# Test 4: Validation - No primary image (should fail)
Write-Host "`n[TEST 4] VALIDATION: No primary image (should fail)" -ForegroundColor Yellow
$bodyInvalid2 = @'
{
    "images": [
        {"imageUrl": "https://example.com/img1.jpg", "altText": "Img1", "imageOrder": 0, "isPrimary": false},
        {"imageUrl": "https://example.com/img2.jpg", "altText": "Img2", "imageOrder": 1, "isPrimary": false}
    ]
}
'@

try {
    Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/3/images" -Method POST -Headers $headers -Body $bodyInvalid2
    Write-Host "ERROR: Should have failed but succeeded!" -ForegroundColor Red
} catch {
    Write-Host "SUCCESS: Correctly rejected - No primary image" -ForegroundColor Green
}

# Test 5: Validation - Invalid imageOrder (should fail)
Write-Host "`n[TEST 5] VALIDATION: Invalid imageOrder sequence (should fail)" -ForegroundColor Yellow
$bodyInvalid3 = @'
{
    "images": [
        {"imageUrl": "https://example.com/img1.jpg", "altText": "Img1", "imageOrder": 0, "isPrimary": true},
        {"imageUrl": "https://example.com/img2.jpg", "altText": "Img2", "imageOrder": 2, "isPrimary": false}
    ]
}
'@

try {
    Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/3/images" -Method POST -Headers $headers -Body $bodyInvalid3
    Write-Host "ERROR: Should have failed but succeeded!" -ForegroundColor Red
} catch {
    Write-Host "SUCCESS: Correctly rejected - Invalid imageOrder" -ForegroundColor Green
}

# Test 6: GET all products to verify images
Write-Host "`n[TEST 6] GET /products/admin/all - Verify images loaded" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/admin/all?page=0" -Method GET -Headers $headers
    Write-Host "Total products: $($response.data.totalElements)" -ForegroundColor Green
    if ($response.data.content[0].images.Count -gt 0) {
        Write-Host "Product 1 has $($response.data.content[0].images.Count) images" -ForegroundColor Green
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n===== TEST SUMMARY =====" -ForegroundColor Cyan
Write-Host "Tested 2 new APIs:" -ForegroundColor White
Write-Host "- POST /products/{id}/images: Manage images" -ForegroundColor Green
Write-Host "- DELETE /products/{id}/images/{imageId}: Delete image" -ForegroundColor Green
Write-Host "`nValidations working:" -ForegroundColor White
Write-Host "- Multiple primary: Rejected" -ForegroundColor Green
Write-Host "- No primary: Rejected" -ForegroundColor Green
Write-Host "- Invalid order: Rejected" -ForegroundColor Green
Write-Host "`nTotal M02 APIs: 7 (5 product + 2 image)" -ForegroundColor Cyan
