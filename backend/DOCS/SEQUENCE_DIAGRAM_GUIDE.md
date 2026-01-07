# HƯỚNG DẪN VẼ SEQUENCE DIAGRAM - MODULE 01 (AUTHENTICATION & USER)

Tài liệu này mô tả chi tiết luồng dữ liệu, các lời gọi hàm, các khối điều khiển (Alt, Opt, Ref) và **kiểu dữ liệu trả về** trong code backend để hỗ trợ việc vẽ Sequence Diagram chuẩn UML.

## Ký hiệu và Quy ước
- **Actor**: Người dùng cuối (User/Admin).
- **View (UI)**: Giao diện người dùng (React Page/Component) - nơi kích hoạt hành động.
- **Controller**: Endpoint hứng request từ UI.
- **Participants**: Controller, Service, Repository, Component, External...
- **Main Sequence**: Luồng chính.
- **Return Type**: Kiểu dữ liệu trả về.

---

## 1. Đăng ký Tài khoản (Register)
**Use Case:** `UC-M01-01`
**Endpoint:** `POST /api/v1/auth/register`

**Participants:**
- **Actor**: User
- **View**: `RegisterPage`
- **Controller**: `AuthController`
- **Service**: `AuthServiceImpl`
- **Repo**: `UserRepository`, `CartRepository`
- **Component**: `PasswordEncoder`, `UserMapper`
- **External**: `EmailService`

**Sequence Flow:**
1. **Actor** -> **View**: Click "Đăng ký" (`submitForm`)
2. **View** -> **Controller**: Call API `register(RegisterRequest)`
3. **Controller** -> **Service**: `register(RegisterRequest)`
4. **Service** thực hiện validation:
    - **[Alt]** `password != confirmPassword`:
        - **Service** -> **Controller**: Throw `BadRequestException`
    - **[Alt]** `userRepository.existsByEmail(email)` == true:
        - **Service** -> **Controller**: Throw `ConflictException`
    - **[Alt]** `userRepository.existsByUsername(username)` == true:
        - **Service** -> **Controller**: Throw `ConflictException`
5. **Service** -> **Component**: `passwordEncoder.encode(password)` -> return `String`
6. **Service**: Create `User` entity (Status=ACTIVE, Role=CUSTOMER)
7. **Service** -> **Repo**: `userRepository.save(user)` -> return `User`
8. **Service**: Create `Cart` entity
9. **Service** -> **Repo**: `cartRepository.save(cart)` -> return `Cart`
10. **[Ref]** Gọi luồng gửi email:
    - **Service** -> **External**: `emailService.sendRegistrationEmail(email, fullName)`
    - **External** --> **Service**: return `void` (Async)
      *(Xem chi tiết tại mục 8.1)*
11. **Service** -> **Component**: `userMapper.toResponse(user)` -> return `UserResponse`
12. **Service** --> **Controller**: return `UserResponse`
13. **Controller** --> **View**: return `ResponseEntity` (201 Created)
14. **View** --> **Actor**: Show success message & Redirect to Login

### Mermaid Code
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as RegisterPage
    participant Controller as AuthController
    participant Service as AuthServiceImpl
    participant UserRepo as UserRepository
    participant CartRepo as CartRepository
    participant PB as PasswordEncoder
    participant Mail as EmailService

    User->>UI: Input Info & Click Register
    activate UI
    UI->>Controller: POST /register
    activate Controller
    Controller->>Service: register(RegisterRequest)
    activate Service
    
    %% Validation
    alt Password Mismatch
        Service-->>Controller: throw BadRequestException
    else Email Exists
        Service->>UserRepo: existsByEmail(email)
        UserRepo-->>Service: boolean
        Service-->>Controller: throw ConflictException
    else Username Exists
        Service->>UserRepo: existsByUsername(username)
        UserRepo-->>Service: boolean
        Service-->>Controller: throw ConflictException
    end

    %% Logic
    Service->>PB: encode(password)
    PB-->>Service: String
    
    Service->>Service: create User(ACTIVE, CUSTOMER)
    Service->>UserRepo: save(user)
    activate UserRepo
    UserRepo-->>Service: User
    deactivate UserRepo
    
    Service->>Service: create Cart
    Service->>CartRepo: save(cart)
    activate CartRepo
    CartRepo-->>Service: Cart
    deactivate CartRepo

    %% Async Email
    par Send Email
        Service->>Mail: sendRegistrationEmail(email, fullName)
        note right of Mail: See 8.1
    end

    Service-->>Controller: UserResponse
    deactivate Service
    Controller-->>UI: 201 Created (UserResponse)
    deactivate Controller
    UI-->>User: Show Success & Redirect
    deactivate UI
```

---

## 2. Đăng nhập (Login)
**Use Case:** `UC-M01-02`
**Endpoint:** `POST /api/v1/auth/login`

**Participants:**
- **Actor**: User
- **View**: `LoginPage`
- **Controller**: `AuthController`
- **Service**: `AuthServiceImpl`
- **Repo**: `UserRepository`
- **Component**: `PasswordEncoder`, `JwtTokenProvider`
- **Cache**: `RedisTemplate`

**Sequence Flow:**
1. **Actor** -> **View**: Input Credentials & Click "Login"
2. **View** -> **Controller**: Call API `login(LoginRequest)`
3. **Controller** -> **Service**: `login(LoginRequest)`
4. **Service** -> **Repo**: `findByEmail(usernameOrEmail)` OR `findByUsername`
5. **Repo** --> **Service**: return `Optional<User>`
6. **[Alt]** User not found:
    - **Service** -> **Controller**: Throw `UnauthorizedException`
7. **[Alt]** Valid user found:
    - **[Opt]** `status == LOCKED`: Throw `UnauthorizedException`
    - **[Opt]** `status != ACTIVE`: Throw `UnauthorizedException`
    - **[Alt]** Password Mismatch:
        - **Service** -> **Controller**: Throw `UnauthorizedException`
    - **[Else]** Password Match:
        - **Service** -> **Component**: `generateAccessToken` -> `String`
        - **Service** -> **Component**: `generateRefreshToken` -> `String`
        - **Service** -> **Cache**: `opsForValue().set(...)` -> `void`
        - **Service** --> **Controller**: return `AuthResponse`
8. **Controller** --> **View**: return `ResponseEntity` (AuthResponse)
9. **View** --> **Actor**: Redirect to Homepage / Dashboard

### Mermaid Code
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as LoginPage
    participant Controller as AuthController
    participant Service as AuthServiceImpl
    participant UserRepo as UserRepository
    participant PB as PasswordEncoder
    participant Jwt as JwtTokenProvider
    participant Redis as RedisTemplate

    User->>UI: Input Credentials & Click Login
    activate UI
    UI->>Controller: POST /login
    activate Controller
    Controller->>Service: login(LoginRequest)
    activate Service
    
    Service->>UserRepo: findByEmailOrUsername
    activate UserRepo
    UserRepo-->>Service: Optional<User>
    deactivate UserRepo

    alt User Not Found
        Service-->>Controller: throw UnauthorizedException
    end

    opt Status == LOCKED
        Service-->>Controller: throw UnauthorizedException
    end
    
    opt Status != ACTIVE
        Service-->>Controller: throw UnauthorizedException
    end

    Service->>PB: matches(rawPw, hashedPw)
    activate PB
    PB-->>Service: boolean
    deactivate PB
    
    alt Password Mismatch
        Service-->>Controller: throw UnauthorizedException
    else Password Match
        Service->>Jwt: generateAccessToken(user)
        Jwt-->>Service: String
        
        Service->>Jwt: generateRefreshToken(user)
        Jwt-->>Service: String
        
        Service->>Redis: set(refreshToken)
        activate Redis
        Redis-->>Service: void
        deactivate Redis
        
        Service-->>Controller: AuthResponse
    end
    
    deactivate Service
    Controller-->>UI: 200 OK (AuthResponse)
    deactivate Controller
    UI-->>User: Redirect to Home
    deactivate UI
```

---

## 3. Đăng nhập Google (OAuth2)
**Use Case:** `UC-M01-03`
**Trigger:** Google OAuth2 Callback

**Participants:**
- **Actor**: User
- **View**: `LoginPage`
- **External**: Google, Spring Security Filter Chain
- **Service**: `CustomOidcUserService`
- **Repo**: `UserRepository`, `CartRepository`
- **Handler**: `OAuth2AuthenticationSuccessHandler`

**Sequence Flow:**
1. **Actor** -> **View**: Click "Login with Google"
2. **View** -> **External**: Redirect to Google Auth
3. **Actor** -> **External**: Consent & Login
4. **External** -> **System**: Callback with Code
5. **System** -> **External**: Exchange Tokens
6. **System** -> **Service**: `loadUser(OidcUserRequest)`
7. **Service** -> **Repo**: `findByEmail(email)`
8. **[Alt]** User Exists (**Case A**):
    - **[Opt]** `LOCKED`: Throw Exception
    - **Service** --> **System**: return `OidcUser`
9. **[Alt]** New User (**Case B**):
    - **Service**: Create User & Cart
    - **Service** -> **Repo**: `userRepository.save()` -> `User`
    - **Service** -> **Repo**: `cartRepository.save()` -> `Cart`
    - **Service** --> **System**: return `OidcUser`
10. **System** -> **Handler**: `onAuthenticationSuccess(...)`
11. **Handler** -> **Component**: Generate Tokens -> `String`
12. **Handler** -> **Cache**: Save Refresh Token -> `void`
13. **Handler** --> **View**: Redirect to Frontend URL (with params)
14. **View** --> **Actor**: Login Success

### Mermaid Code
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as LoginPage
    participant Google
    participant SpringSec as SecurityFilterChain
    participant Service as CustomOidcUserService
    participant UserRepo as UserRepository
    participant CartRepo as CartRepository
    participant Handler as AuthSuccessHandler
    participant Jwt as JwtTokenProvider
    participant Redis as RedisTemplate

    User->>UI: Click 'Login with Google'
    activate UI
    UI->>Google: Redirect Auth
    deactivate UI
    
    User->>Google: Login & Consent
    Google-->>SpringSec: Auth Code
    SpringSec->>Google: Exchange Code
    Google-->>SpringSec: ID Token / Access Token
    
    SpringSec->>Service: loadUser(OidcUserRequest)
    activate Service
    
    Service->>UserRepo: findByEmail(email)
    activate UserRepo
    UserRepo-->>Service: Optional<User>
    deactivate UserRepo
    
    alt User Exists
        opt Status == LOCKED
            Service-->>SpringSec: Throw Exception
        end
        Service-->>SpringSec: OidcUser
    else New User
        Service->>Service: Create User (ACTIVE, CUSTOMER)
        Service->>UserRepo: save(user)
        UserRepo-->>Service: User
        Service->>CartRepo: save(cart)
        CartRepo-->>Service: Cart
        Service-->>SpringSec: OidcUser
    end
    deactivate Service

    SpringSec->>Handler: onAuthenticationSuccess()
    activate Handler
    
    Handler->>Jwt: generateAccessToken()
    Jwt-->>Handler: String
    
    Handler->>Jwt: generateRefreshToken()
    Jwt-->>Handler: String
    
    Handler->>Redis: opsForValue().set()
    Redis-->>Handler: void
    
    Handler-->>UI: Redirect with Tokens
    deactivate Handler
    activate UI
    UI-->>User: Login Success
    deactivate UI
```

---

## 4. Quên Mật khẩu (Forgot Password)

### 4.1. Yêu cầu OTP (Request)
**Endpoint:** `POST /api/v1/auth/forgot-password/request`
**View**: `ForgotPasswordPage`

1. **Actor** -> **View**: Input Email & Submit
2. **View** -> **Controller**: Call API `requestPasswordReset(email)`
3. **Controller** -> **Service**: `requestPasswordReset(email)`
4. **Service** -> **Repo**: `findByEmail(email)` -> `Optional<User>`
5. **[Alt]** Not Found: Return Silent
6. **[Else]** Found:
    - **Service** -> **Component**: Generate OTP -> `String`
    - **Service** -> **Cache**: Save OTP -> `void`
    - **[Ref]** Gọi luồng gửi email:
        - **Service** -> **External**: `emailService.sendOtpEmail(email, otp)`
        - **External** --> **Service**: return `void`
          *(Xem chi tiết mục 8.2)*
7. **Controller** --> **View**: return `ResponseEntity` (200 OK)
8. **View** --> **Actor**: Show "Check Email" Message

### Mermaid Code
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as ForgotPasswordPage
    participant Controller as AuthController
    participant Service as AuthServiceImpl
    participant UserRepo as UserRepository
    participant OtpGen as OtpGenerator
    participant Redis as RedisTemplate
    participant Mail as EmailService

    User->>UI: Input Email & Submit
    activate UI
    UI->>Controller: POST /forgot-password/request
    activate Controller
    Controller->>Service: requestPasswordReset(email)
    activate Service

    Service->>UserRepo: findByEmail(email)
    activate UserRepo
    UserRepo-->>Service: Optional<User>
    deactivate UserRepo

    alt User Not Found
        Service-->>Controller: void (Return)
    else User Found
        Service->>OtpGen: generate(6)
        OtpGen-->>Service: String
        
        Service->>Redis: set(key, otp)
        activate Redis
        Redis-->>Service: void
        deactivate Redis
        
        Service->>Mail: sendOtpEmail(email, otp)
        note right of Mail: See 8.2
    end
    
    Service-->>Controller: void
    deactivate Service
    Controller-->>UI: 200 OK
    deactivate Controller
    UI-->>User: Show Check Email Message
    deactivate UI
```

### 4.2. Xác thực & Đổi mật khẩu (Reset)
**Endpoint:** `POST /api/v1/auth/forgot-password/reset`
**View**: `ResetPasswordPage`

1. **Actor** -> **View**: Input OTP & New Password
2. **View** -> **Controller**: Call API `verifyOtpAndResetPassword`
3. **Controller** -> **Service**: `verifyOtpAndResetPassword`
4. **Service** -> **Cache**: Get OTP -> `String`
5. **[Alt]** Invalid OTP: Throw `BadRequestException`
6. **[Else]** Valid:
    - **Service** -> **Repo**: `findByEmail` -> `Optional<User>`
    - **Service** -> **Component**: Encode PW -> `String`
    - **Service** -> **Repo**: Save User -> `User`
    - **Service** -> **Cache**: Delete OTP -> `Boolean`
    - **[Ref]** Send Confirm Email
7. **Controller** --> **View**: return `ResponseEntity` (200 OK)
8. **View** --> **Actor**: Show Success & Redirect Login

### Mermaid Code
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as ResetPasswordPage
    participant Controller as AuthController
    participant Service as AuthServiceImpl
    participant UserRepo as UserRepository
    participant PB as PasswordEncoder
    participant Redis as RedisTemplate
    participant Mail as EmailService

    User->>UI: Input OTP & New Password
    activate UI
    UI->>Controller: POST /forgot-password/reset
    activate Controller
    Controller->>Service: verifyOtpAndResetPassword(req)
    activate Service

    Service->>Redis: get(key)
    activate Redis
    Redis-->>Service: String (OTP)
    deactivate Redis

    alt Invalid/Expired OTP
        Service-->>Controller: throw BadRequestException
    else Valid OTP
        Service->>UserRepo: findByEmail(email)
        UserRepo-->>Service: Optional<User>
        
        Service->>PB: encode(newPassword)
        PB-->>Service: String (Hash)
        
        Service->>UserRepo: save(user)
        Service->>Redis: delete(key)
        
        Service->>Mail: sendPasswordResetEmail(email)
        note right of Mail: Send Notification
        
        Service-->>Controller: void
    end
    
    deactivate Service
    Controller-->>UI: 200 OK
    deactivate Controller
    UI-->>User: Show Success & Redirect
    deactivate UI
```

---

## 5. Đăng xuất (Logout)
**Use Case:** `UC-M01-04`
**Endpoint:** `POST /api/v1/auth/logout`

1. **Actor** -> **View**: Click "Logout"
2. **View** -> **Controller**: Call API `logout`
3. **Controller** -> **Service**: `logout(request)`
4. **Service** -> **Cache**: `delete(token)` -> `Boolean`
5. **Controller** --> **View**: return `200 OK`
6. **View** --> **Actor**: Redirect to Login

### Mermaid Code
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Header/Menu
    participant Controller as AuthController
    participant Service as AuthServiceImpl
    participant Redis as RedisTemplate

    User->>UI: Click Logout
    activate UI
    UI->>Controller: POST /logout
    activate Controller
    Controller->>Service: logout(request)
    activate Service
    
    Service->>Redis: delete(refreshToken)
    Redis-->>Service: Boolean
    
    Service-->>Controller: void
    deactivate Service
    Controller-->>UI: 200 OK
    deactivate Controller
    UI-->>User: Redirect to Login
    deactivate UI
```

---

## 6. Cập nhật Hồ sơ (Update Profile)
**Use Case:** `UC-M01-06`
**Endpoint:** `PUT /api/v1/user/profile`

1. **Actor** -> **View**: Edit Info & Save
2. **View** -> **Controller**: Call API `updateProfile`
3. **Controller** -> **Service**: `updateProfile`
4. **Service** -> **Repo**: `findById` -> `Optional<User>`
5. **[Alt]** Not Found: Throw Exception
6. **Service**: Update Fields
7. **Service** -> **Repo**: `save(user)` -> `User`
8. **Service** -> **Component**: Map info -> `UserResponse`
9. **Controller** --> **View**: return `UserResponse`
10. **View** --> **Actor**: Update UI Info

### Mermaid Code
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as ProfilePage
    participant Controller as UserController
    participant Service as UserServiceImpl
    participant Repo as UserRepository
    participant Mapper as UserMapper

    User->>UI: Edit Profile & Save
    activate UI
    UI->>Controller: PUT /user/profile
    activate Controller
    
    note over Controller: Get userId from SecurityContext
    
    Controller->>Service: updateProfile(userId, request)
    activate Service
    
    Service->>Repo: findById(userId)
    activate Repo
    Repo-->>Service: Optional<User>
    deactivate Repo
    
    alt User Not Found
        Service-->>Controller: throw NotFoundException
    end
    
    Service->>Service: Update fields
    Service->>Repo: save(user)
    activate Repo
    Repo-->>Service: User
    deactivate Repo
    
    Service->>Mapper: toResponse(user)
    Mapper-->>Service: UserResponse
    
    Service-->>Controller: UserResponse
    deactivate Service
    Controller-->>UI: 200 OK (UserResponse)
    deactivate Controller
    UI-->>User: Show Updated Info
    deactivate UI
```

---

---

## 7. Quản lý Địa chỉ Giao hàng (Manage Addresses)
**Use Case:** `UC-M01-07`
**Participants:**
- **Actor**: User
- **View**: `AddressPage`
- **Controller**: `AddressController`
- **Service**: `AddressServiceImpl`
- **Repo**: `AddressRepository`
- **Util**: `SecurityUtils`

### 7.1. Lấy danh sách địa chỉ
**Endpoint:** `GET /api/v1/user/addresses`

1. **Actor** -> **View**: View Addresses
2. **View** -> **Controller**: Call API `getAddresses`
3. **Controller** -> **Util**: `getCurrentUserId()` -> `Long`
4. **Controller** -> **Service**: `getUserAddresses(userId)`
5. **Service** -> **Repo**: `findByUserId(userId)` -> `List<Address>`
6. **Service** -> **Component**: Map to DTO -> `List<AddressResponse>`
7. **Controller** --> **View**: return `List<AddressResponse>`
8. **View** --> **Actor**: Display List

#### Mermaid Code
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as AddressPage
    participant Controller as AddressController
    participant Service as AddressServiceImpl
    participant Repo as AddressRepository

    User->>UI: Open Address Page
    activate UI
    UI->>Controller: GET /addresses
    activate Controller
    Controller->>Service: getUserAddresses(userId)
    activate Service
    
    Service->>Repo: findByUserId(userId)
    activate Repo
    Repo-->>Service: List<Address>
    deactivate Repo
    
    Service-->>Controller: List<AddressResponse>
    deactivate Service
    Controller-->>UI: 200 OK
    deactivate Controller
    UI-->>User: Show List
    deactivate UI
```

### 7.2. Thêm mới / Cập nhật / Xóa / Mặc định (CRUD)
*(Mô tả chung cho các thao tác ghi)*
**Endpoint:** `POST, PUT, DELETE /api/v1/user/addresses`

1. **Actor** -> **View**: Perform Action (Add/Edit/Delete)
2. **View** -> **Controller**: Call API
3. **Controller** -> **Service**: Call Method (`create`, `update`, `delete`, `setDefault`)
4. **Service**: Business Logic (Check Limit, Check Exists)
5. **Service** -> **Repo**: Save/Delete Entity
6. **Controller** --> **View**: return Response
7. **View** --> **Actor**: Update UI

#### Mermaid Code (Create Address Example)
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as AddressPage
    participant Controller as AddressController
    participant Service as AddressServiceImpl
    participant Repo as AddressRepository

    User->>UI: Input Info & Save
    activate UI
    UI->>Controller: POST /addresses
    activate Controller
    Controller->>Service: createAddress(userId, request)
    activate Service
    
    Service->>Repo: countByUserId(userId)
    Repo-->>Service: int
    
    opt Limit Reached
        Service-->>Controller: throw BadRequestException
    end
    
    Service->>Repo: save(address)
    Repo-->>Service: Address
    
    Service-->>Controller: AddressResponse
    deactivate Service
    Controller-->>UI: 201 Created
    deactivate Controller
    UI-->>User: Update List
    deactivate UI
```

---

## 8. Các Luồng phụ (Reference Flows)

### 8.1. Gửi Email Chào mừng
**Method:** `EmailService.sendRegistrationEmail(email, fullName)`
**ReturnType:** `void`

1. **AuthService** -> **EmailService**: `sendRegistrationEmail(...)`
2. **EmailService**: Prepare `Context`
3. **EmailService**: `templateEngine.process(...)` -> return `String` (HTML)
4. **EmailService** -> **JavaMailSender**: `createMimeMessage()` -> return `MimeMessage`
5. **EmailService** -> **JavaMailSender**: `send(message)` -> return `void`

#### Mermaid Code
```mermaid
sequenceDiagram
    autonumber
    participant Caller as AuthService
    participant Service as EmailService
    participant Engine as TemplateEngine
    participant Sender as JavaMailSender

    Caller->>Service: sendRegistrationEmail(email, name)
    activate Service
    
    Service->>Service: context.setVariable("fullName", name)
    Service->>Engine: process("registration-email", context)
    activate Engine
    Engine-->>Service: String (HTML)
    deactivate Engine
    
    Service->>Sender: createMimeMessage()
    Sender-->>Service: MimeMessage
    Service->>Sender: send(message)
    activate Sender
    
    alt SMTP Error
        Sender-->>Service: Throw MailException
        Service-->>Service: Log Error (Swallow Exception)
    else Success
        Sender-->>Service: void
    end
    deactivate Sender
    
    Service-->>Caller: void (Async)
    deactivate Service
```

### 8.2. Gửi Email OTP
**Method:** `EmailService.sendOtpEmail(email, otp)`
**ReturnType:** `void`

1. **AuthService** -> **EmailService**: `sendOtpEmail(...)`
2. **EmailService**: Prepare `Context`
3. **EmailService**: `templateEngine.process(...)` -> return `String` (HTML)
4. **EmailService** -> **JavaMailSender**: `send(message)` -> return `void`

#### Mermaid Code
```mermaid
sequenceDiagram
    autonumber
    participant Caller as AuthService
    participant Service as EmailService
    participant Engine as TemplateEngine
    participant Sender as JavaMailSender

    Caller->>Service: sendOtpEmail(email, otp)
    activate Service
    
    Service->>Service: context.setVariable("otp", otp)
    Service->>Engine: process("password-reset-otp", context)
    activate Engine
    Engine-->>Service: String (HTML)
    deactivate Engine
    
    Service->>Sender: send(message)
    activate Sender
    
    alt SMTP Error
        Sender-->>Service: Throw MailException
        Service-->>Caller: Throw EmailServiceException
    else Success
        Sender-->>Service: void
        Service-->>Caller: void
    end
    deactivate Sender
    deactivate Service
```

### 8.3. Gửi Email Thanh toán Thành công
**Method:** `EmailService.sendOrderPaymentSuccessEmail(...)`
**ReturnType:** `void`

1. **Caller** -> **EmailService**: `sendOrderPaymentSuccessEmail`
2. **EmailService**: `templateEngine.process(...)` -> return `String` (HTML)
3. **EmailService** -> **JavaMailSender**: `send(message)` -> return `void`

#### Mermaid Code
```mermaid
sequenceDiagram
    autonumber
    participant Caller as PaymentService
    participant Service as EmailService
    participant Engine as TemplateEngine
    participant Sender as JavaMailSender

    Caller->>Service: sendOrderPaymentSuccessEmail(...)
    activate Service
    
    Service->>Service: formatCurrency(totalAmount)
    Service->>Service: context.setVariables(orderInfo)
    
    Service->>Engine: process("order-payment-success", context)
    activate Engine
    Engine-->>Service: String (HTML)
    deactivate Engine
    
    Service->>Sender: send(message)
    activate Sender
    
    alt SMTP Error
        Sender-->>Service: Throw MailException
        Service-->>Service: Log Error Only
    else Success
        Sender-->>Service: void
    end
    deactivate Sender
    
    Service-->>Caller: void
    deactivate Service
```
