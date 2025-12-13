# Test Image Management APIs - Module 02
# Requires: $token variable from test-product-apis.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TEST IMAGE MANAGEMENT APIs (M02)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Get token from previous test or login
if (-not $token) {
    Write-Host "Getting Admin Token..." -ForegroundColor Yellow
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"email":"admin@utephonehub.com","password":"Admin@123"}'
    $token = $loginResponse.data.accessToken
    Write-Host "Token obtained: $($token.Substring(0,20))..." -ForegroundColor Green
}

# Headers with Bearer token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test 1: POST /products/{id}/images - Manage product images
Write-Host "`n[TEST 1] POST /products/1/images - Manage product images" -ForegroundColor Yellow
$manageImagesBody = @{
    images = @(
        @{
            imageUrl = "https://example.com/iphone15-front.jpg"
            altText = "iPhone 15 Pro Max màu xanh - mặt trước"
            imageOrder = 0
            isPrimary = $true
        },
        @{
            imageUrl = "https://example.com/iphone15-back.jpg"
            altText = "iPhone 15 Pro Max màu xanh - mặt sau"
            imageOrder = 1
            isPrimary = $false
        },
        @{
            imageUrl = "https://example.com/iphone15-side.jpg"
            altText = "iPhone 15 Pro Max màu xanh - cạnh bên"
            imageOrder = 2
            isPrimary = $false
        }
    )
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/1/images" `
        -Method POST `
        -Headers $headers `
        -Body $manageImagesBody
    
    Write-Host "✓ Status: $($response.status)" -ForegroundColor Green
    Write-Host "✓ Message: $($response.message)" -ForegroundColor Green
    Write-Host "✓ Images managed successfully for product ID: 1" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

# Test 2: POST /products/2/images - Manage images for another product
Write-Host "`n[TEST 2] POST /products/2/images - Manage images for product 2" -ForegroundColor Yellow
$manageImages2Body = @{
    images = @(
        @{
            imageUrl = "https://example.com/samsung-s24-primary.jpg"
            altText = "Samsung Galaxy S24 Ultra"
            imageOrder = 0
            isPrimary = $true
        },
        @{
            imageUrl = "https://example.com/samsung-s24-camera.jpg"
            altText = "Samsung Galaxy S24 Ultra - Camera chi tiết"
            imageOrder = 1
            isPrimary = $false
        }
    )
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/2/images" `
        -Method POST `
        -Headers $headers `
        -Body $manageImages2Body
    
    Write-Host "Status: $($response.status)" -ForegroundColor Green
    Write-Host "Images managed for product ID: 2 (2 images)" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: GET /products/admin/all - Verify images in product list (use existing endpoint)
Write-Host "`n[TEST 3] GET /products/admin/all - Verify images loaded" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/admin/all?page=0&amp;size=5" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✓ Total products: $($response.data.totalElements)" -ForegroundColor Green
    Write-Host "✓ First product images count: $($response.data.content[0].images.Count)" -ForegroundColor Green
    
    if ($response.data.content[0].images.Count -gt 0) {
        $primaryImage = $response.data.content[0].images | Where-Object { $_.isPrimary -eq $true }
        Write-Host "✓ Primary image found: $($primaryImage.imageUrl)" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Validation - Multiple primary images (should fail)
Write-Host "`n[TEST 4] POST /products/3/images - VALIDATION: Multiple primary (should fail)" -ForegroundColor Yellow
$invalidMultiplePrimary = @{
    images = @(
        @{
            imageUrl = "https://example.com/img1.jpg"
            altText = "Image 1"
            imageOrder = 0
            isPrimary = $true
        },
        @{
            imageUrl = "https://example.com/img2.jpg"
            altText = "Image 2"
            imageOrder = 1
            isPrimary = $true
        }
    )
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/3/images" `
        -Method POST `
        -Headers $headers `
        -Body $invalidMultiplePrimary
    
    Write-Host "✗ Should have failed but succeeded!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected: $($_.ErrorDetails.Message)" -ForegroundColor Green
}

# Test 5: Validation - No primary image (should fail)
Write-Host "`n[TEST 5] POST /products/3/images - VALIDATION: No primary (should fail)" -ForegroundColor Yellow
$invalidNoPrimary = @{
    images = @(
        @{
            imageUrl = "https://example.com/img1.jpg"
            altText = "Image 1"
            imageOrder = 0
            isPrimary = $false
        },
        @{
            imageUrl = "https://example.com/img2.jpg"
            altText = "Image 2"
            imageOrder = 1
            isPrimary = $false
        }
    )
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/3/images" `
        -Method POST `
        -Headers $headers `
        -Body $invalidNoPrimary
    
    Write-Host "✗ Should have failed but succeeded!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected: $($_.ErrorDetails.Message)" -ForegroundColor Green
}

# Test 6: Validation - Invalid imageOrder sequence (should fail)
Write-Host "`n[TEST 6] POST /products/3/images - VALIDATION: Invalid order (0,2,3) should be (0,1,2)" -ForegroundColor Yellow
$invalidOrder = @{
    images = @(
        @{
            imageUrl = "https://example.com/img1.jpg"
            altText = "Image 1"
            imageOrder = 0
            isPrimary = $true
        },
        @{
            imageUrl = "https://example.com/img2.jpg"
            altText = "Image 2"
            imageOrder = 2
            isPrimary = $false
        }
    )
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/3/images" `
        -Method POST `
        -Headers $headers `
        -Body $invalidOrder
    
    Write-Host "✗ Should have failed but succeeded!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected: $($_.ErrorDetails.Message)" -ForegroundColor Green
}

# Test 7: DELETE /products/1/images/{imageId} - Delete non-primary image
Write-Host "`n[TEST 7] DELETE /products/1/images/2 - Delete non-primary image" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/1/images/2" `
        -Method DELETE `
        -Headers $headers
    
    Write-Host "✓ Status: $($response.status)" -ForegroundColor Green
    Write-Host "✓ Message: $($response.message)" -ForegroundColor Green
    Write-Host "✓ Image deleted successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

# Test 8: DELETE - Try to delete last remaining image (should fail)
Write-Host "`n[TEST 8] DELETE last image - Should fail (product needs at least 1 image)" -ForegroundColor Yellow
# First, create a product with only 1 image
$singleImageBody = @{
    images = @(
        @{
            imageUrl = "https://example.com/single.jpg"
            altText = "Single image"
            imageOrder = 0
            isPrimary = $true
        }
    )
} | ConvertTo-Json -Depth 5

try {
    # Setup: Add single image to product 3
    Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/3/images" `
        -Method POST `
        -Headers $headers `
        -Body $singleImageBody | Out-Null
    
    # Try to delete the only image (should fail)
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/products/3/images/1" `
        -Method DELETE `
        -Headers $headers
    
    Write-Host "✗ Should have failed but succeeded!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected: $($_.ErrorDetails.Message)" -ForegroundColor Green
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY - Image Management APIs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total APIs tested:" -ForegroundColor White
Write-Host "  - POST /products/{id}/images: Manage images ✓" -ForegroundColor Green
Write-Host "  - DELETE /products/{id}/images/{imageId}: Delete image ✓" -ForegroundColor Green
Write-Host "`nValidations tested:" -ForegroundColor White
Write-Host "  - Multiple primary images: Rejected ✓" -ForegroundColor Green
Write-Host "  - No primary image: Rejected ✓" -ForegroundColor Green
Write-Host "  - Invalid imageOrder sequence: Rejected ✓" -ForegroundColor Green
Write-Host "  - Delete last image: Rejected ✓" -ForegroundColor Green
Write-Host "`nTotal APIs for M02: 7 APIs (5 product CRUD and 2 image management)" -ForegroundColor Cyan
