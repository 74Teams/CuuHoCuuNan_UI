# 📚 API Documentation - RescueSystem

**Last Updated:** January 2025  
**API Version:** v1.0  
**Base URL:** `http://localhost:5000/api`

---

## 📑 Table of Contents

1. [Authentication (Auth)](#1-authentication)
2. [Users](#2-users)
3. [Locations](#3-locations)
4. [Requests (Yêu Cầu Cứu Hộ)](#4-requests)
5. [Rescue Teams](#5-rescue-teams)
6. [Missions](#6-missions)
7. [Reports](#7-reports)
8. [Contacts](#8-contacts)
9. [Roles](#9-roles)

---

## 1. Authentication

### 1.1 Register

- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Auth Required:** ❌ No
- **Description:** Đăng ký tài khoản mới

**Request:**

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0912345678",
  "roles": ["User", "Rescuer"]
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Đăng ký tài khoản thành công",
  "data": null
}
```

**Error (400 Bad Request):**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Email đã được sử dụng"
}
```

---

### 1.2 Login

- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Auth Required:** ❌ No
- **Description:** Đăng nhập hệ thống

**Request:**

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A",
      "roles": ["User", "Rescuer"]
    }
  }
}
```

---

### 1.3 Get Profile

- **Method:** `GET`
- **Endpoint:** `/api/auth/profile`
- **Auth Required:** ✅ Yes (Bearer Token)
- **Description:** Lấy thông tin profile người dùng hiện tại

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy thông tin người dùng thành công",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "phoneNumber": "0912345678",
    "address": {
      "street": "123 Đường Lê Lợi",
      "city": "Hà Nội",
      "district": "Hoàn Kiếm",
      "gps": "21.0285,105.8542"
    },
    "roles": ["User", "Rescuer"]
  }
}
```

---

### 1.4 Update Profile

- **Method:** `PUT`
- **Endpoint:** `/api/auth/profile`
- **Auth Required:** ✅ Yes
- **Description:** Cập nhật thông tin profile

**Request:**

```json
{
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0912345678",
  "address": {
    "street": "123 Đường Lê Lợi",
    "city": "Hà Nội",
    "district": "Hoàn Kiếm",
    "gps": "21.0285,105.8542"
  }
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Update profile successfully"
}
```

---

### 1.5 Upload Avatar

- **Method:** `POST`
- **Endpoint:** `/api/auth/avatar`
- **Auth Required:** ✅ Yes
- **Description:** Upload ảnh đại diện

**Request:** (Form-data)

```
file: [image file]
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Upload avatar success",
  "data": {
    "avatarUrl": "https://cloudinary.com/image.jpg",
    "publicId": "user-avatar-123"
  }
}
```

---

### 1.6 Forgot Password

- **Method:** `POST`
- **Endpoint:** `/api/auth/forgot-password`
- **Auth Required:** ❌ No
- **Description:** Gửi link reset password qua email

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Reset password link sent to email"
}
```

---

### 1.7 Reset Password

- **Method:** `POST`
- **Endpoint:** `/api/auth/reset-password`
- **Auth Required:** ❌ No
- **Description:** Reset password với token từ email

**Request:**

```json
{
  "email": "user@example.com",
  "token": "reset-token-from-email",
  "newPassword": "NewPassword123!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset successfully"
}
```

---

## 2. Users

### 2.1 Create User

- **Method:** `POST`
- **Endpoint:** `/api/users`
- **Auth Required:** ✅ Yes (Admin)
- **Description:** Tạo người dùng mới

**Request:**

```json
{
  "email": "newuser@example.com",
  "password": "Password123!",
  "fullName": "Trần Văn B",
  "phoneNumber": "0987654321",
  "roles": ["Rescuer", "RescuerLeader"]
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Create user successfully",
  "data": null
}
```

---

### 2.2 Get All Users

- **Method:** `GET`
- **Endpoint:** `/api/users`
- **Auth Required:** ✅ Yes (Admin)
- **Description:** Lấy danh sách tất cả người dùng

**Query Parameters:**

```
?pageNumber=1&pageSize=10
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Get all users successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user1@example.com",
      "fullName": "Nguyễn Văn A",
      "phoneNumber": "0912345678",
      "roles": ["User", "Rescuer"],
      "createdAt": "2025-01-15T10:30:00Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "email": "user2@example.com",
      "fullName": "Trần Văn B",
      "phoneNumber": "0987654321",
      "roles": ["Dispatcher"],
      "createdAt": "2025-01-14T09:15:00Z"
    }
  ]
}
```

---

### 2.3 Get User by ID

- **Method:** `GET`
- **Endpoint:** `/api/users/{userId}`
- **Auth Required:** ✅ Yes
- **Description:** Lấy thông tin user theo ID

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Get user by id successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "phoneNumber": "0912345678",
    "roles": ["User", "Rescuer"],
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### 2.4 Update User

- **Method:** `PUT`
- **Endpoint:** `/api/users/{userId}`
- **Auth Required:** ✅ Yes (Admin or Self)
- **Description:** Cập nhật thông tin user

**Request:**

```json
{
  "fullName": "Nguyễn Văn A Updated",
  "phoneNumber": "0912345678",
  "roles": ["Rescuer", "RescuerLeader"]
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cập nhật thông tin người dùng thành công."
}
```

---

### 2.5 Delete User

- **Method:** `DELETE`
- **Endpoint:** `/api/users/{userId}`
- **Auth Required:** ✅ Yes (Admin)
- **Description:** Xóa người dùng

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Delete user successfully"
}
```

---

## 3. Locations

### 3.1 Get All Locations

- **Method:** `GET`
- **Endpoint:** `/api/locations`
- **Auth Required:** ❌ No
- **Description:** Lấy danh sách tất cả vị trí

**Query Parameters:**

```
?pageNumber=1&pageSize=20
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy danh sách vị trí thành công",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "latitude": 21.0285,
      "longitude": 105.8542,
      "address": "123 Đường Lê Lợi, Hà Nội",
      "landmark": "Gần Hoan Kiem Lake",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### 3.2 Get Location by ID

- **Method:** `GET`
- **Endpoint:** `/api/locations/{locationId}`
- **Auth Required:** ❌ No
- **Description:** Lấy chi tiết vị trí

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy vị trí thành công",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "latitude": 21.0285,
    "longitude": 105.8542,
    "address": "123 Đường Lê Lợi, Hà Nội",
    "landmark": "Gần Hoan Kiem Lake",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### 3.3 Create Location

- **Method:** `POST`
- **Endpoint:** `/api/locations`
- **Auth Required:** ✅ Yes (Dispatcher, Admin)
- **Description:** Tạo vị trí mới

**Request:**

```json
{
  "latitude": 21.0285,
  "longitude": 105.8542,
  "address": "123 Đường Lê Lợi, Hà Nội",
  "landmark": "Gần Hoan Kiem Lake"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Tạo vị trí thành công",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "latitude": 21.0285,
    "longitude": 105.8542,
    "address": "123 Đường Lê Lợi, Hà Nội",
    "landmark": "Gần Hoan Kiem Lake",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### 3.4 Update Location

- **Method:** `PUT`
- **Endpoint:** `/api/locations/{locationId}`
- **Auth Required:** ✅ Yes (Dispatcher, Admin)
- **Description:** Cập nhật thông tin vị trí

**Request:**

```json
{
  "address": "456 Đường Trần Hưng Đạo, Hà Nội",
  "landmark": "Gần Chợ Đôi Canhãng"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cập nhật vị trí thành công"
}
```

---

### 3.5 Delete Location

- **Method:** `DELETE`
- **Endpoint:** `/api/locations/{locationId}`
- **Auth Required:** ✅ Yes (Admin)
- **Description:** Xóa vị trí

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Xóa vị trí thành công"
}
```

---

## 4. Requests (Yêu Cầu Cứu Hộ)

### 4.1 Create Request

- **Method:** `POST`
- **Endpoint:** `/api/requests`
- **Auth Required:** ❌ No (Public)
- **Description:** Tạo yêu cầu cứu hộ mới

**Request:** (Form-data)

```
emergencyType: 1 (FIRE, FLOOD, EARTHQUAKE, MEDICAL_EMERGENCY, TRAFFIC_EMERGENCY, BUILDING_COLLAPSE, NATURAL_DISASTER, OTHER)
priority: 1 (CRITICAL=1, HIGH=2, MEDIUM=3, LOW=4)
description: "Cháy nhà tại số 123 đường Lê Lợi"
locationId: "550e8400-e29b-41d4-a716-446655440000"
medias: [image1.jpg, image2.jpg]
```

**Response (201 Created):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Tạo yêu cầu cứu hộ thành công",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

### 4.2 Get All Requests (Pagination & Filter)

- **Method:** `GET`
- **Endpoint:** `/api/requests`
- **Auth Required:** ✅ Yes
- **Description:** Lấy danh sách yêu cầu cứu hộ (có pagination & filter)

**Query Parameters:**

```
?pageNumber=1
&pageSize=10
&status=PENDING
&priority=CRITICAL
&emergencyType=FIRE
&sortBy=CreatedAt
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy danh sách yêu cầu cứu hộ thành công",
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "emergencyType": "FIRE",
        "priority": "CRITICAL",
        "status": "PENDING",
        "description": "Cháy nhà tại số 123 đường Lê Lợi",
        "location": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "latitude": 21.0285,
          "longitude": 105.8542,
          "address": "123 Đường Lê Lợi, Hà Nội"
        },
        "requestedBy": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "fullName": "Nguyễn Văn A",
          "phoneNumber": "0912345678"
        },
        "medias": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440003",
            "mediaUrl": "https://cloudinary.com/image1.jpg",
            "mediaType": "IMAGE"
          }
        ],
        "createdAt": "2025-01-15T10:30:00Z",
        "updatedAt": "2025-01-15T10:30:00Z"
      }
    ],
    "totalCount": 150,
    "totalPages": 15,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

---

### 4.3 Get Request by ID

- **Method:** `GET`
- **Endpoint:** `/api/requests/{requestId}`
- **Auth Required:** ✅ Yes
- **Description:** Lấy chi tiết yêu cầu cứu hộ

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy yêu cầu cứu hộ thành công",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "emergencyType": "FIRE",
    "priority": "CRITICAL",
    "status": "PENDING",
    "description": "Cháy nhà tại số 123 đường Lê Lợi",
    "location": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "latitude": 21.0285,
      "longitude": 105.8542,
      "address": "123 Đường Lê Lợi, Hà Nội",
      "landmark": "Gần Hoan Kiem Lake"
    },
    "requestedBy": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "fullName": "Nguyễn Văn A",
      "phoneNumber": "0912345678",
      "email": "user@example.com"
    },
    "medias": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "mediaUrl": "https://cloudinary.com/image1.jpg",
        "mediaType": "IMAGE"
      }
    ],
    "missions": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440004",
        "status": "IN_PROGRESS"
      }
    ],
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T11:45:00Z"
  }
}
```

---

### 4.4 Update Request

- **Method:** `PUT`
- **Endpoint:** `/api/requests/{requestId}`
- **Auth Required:** ✅ Yes (Creator or Dispatcher)
- **Description:** Cập nhật yêu cầu cứu hộ (chỉ khi status = PENDING)

**Request:** (Form-data)

```
emergencyType: 1
priority: 2
description: "Cháy lớn tại số 123 đường Lê Lợi - cần nhiều đội"
locationId: "550e8400-e29b-41d4-a716-446655440000"
medias: [image1.jpg, image2.jpg]
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cập nhật yêu cầu cứu hộ thành công",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

### 4.5 Delete Request

- **Method:** `DELETE`
- **Endpoint:** `/api/requests/{requestId}`
- **Auth Required:** ✅ Yes (Creator or Admin)
- **Description:** Xóa yêu cầu cứu hộ (chỉ khi status = PENDING)

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Xóa yêu cầu cứu hộ thành công",
  "data": {
    "deleted": true
  }
}
```

---

### 4.6 Change Request Status

- **Method:** `PUT`
- **Endpoint:** `/api/requests/{requestId}/status`
- **Auth Required:** ✅ Yes (Dispatcher)
- **Description:** Thay đổi trạng thái yêu cầu (PENDING→ACCEPTED→IN_PROGRESS→COMPLETED)

**Request:**

```json
{
  "newStatus": "ACCEPTED",
  "note": "Đã chấp nhận yêu cầu, đội sắp tới"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cập nhật trạng thái thành công"
}
```

---

### 4.7 Get Request History

- **Method:** `GET`
- **Endpoint:** `/api/requests/{requestId}/history`
- **Auth Required:** ✅ Yes
- **Description:** Lấy lịch sử thay đổi trạng thái yêu cầu

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy lịch sử yêu cầu thành công",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "fromStatus": "PENDING",
      "toStatus": "ACCEPTED",
      "changedById": "550e8400-e29b-41d4-a716-446655440002",
      "note": "Đã chấp nhận yêu cầu",
      "changedBy": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "fullName": "Trần Văn B",
        "email": "dispatcher@example.com"
      },
      "createdAt": "2025-01-15T10:35:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "fromStatus": "ACCEPTED",
      "toStatus": "IN_PROGRESS",
      "changedById": "550e8400-e29b-41d4-a716-446655440003",
      "note": "Đội đang di chuyển tới",
      "changedBy": {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "fullName": "Phạm Văn C",
        "email": "rescuer@example.com"
      },
      "createdAt": "2025-01-15T10:45:00Z"
    }
  ]
}
```

---

## 5. Rescue Teams

### 5.1 Get All Rescue Teams

- **Method:** `GET`
- **Endpoint:** `/api/rescue-teams`
- **Auth Required:** ✅ Yes (Dispatcher, RescuerLeader)
- **Description:** Lấy danh sách tất cả đội cứu hộ

**Query Parameters:**

```
?pageNumber=1&pageSize=10&status=ACTIVE
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Get all rescue teams successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Đội Cứu Hộ 1",
      "description": "Đội chuyên cứu hộ cháy",
      "status": "ACTIVE",
      "leaderId": "550e8400-e29b-41d4-a716-446655440001",
      "leader": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "fullName": "Phạm Văn C"
      },
      "memberCount": 5,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### 5.2 Get Rescue Team by ID

- **Method:** `GET`
- **Endpoint:** `/api/rescue-teams/{teamId}`
- **Auth Required:** ✅ Yes
- **Description:** Lấy chi tiết đội cứu hộ

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Get rescue team successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Đội Cứu Hộ 1",
    "description": "Đội chuyên cứu hộ cháy",
    "status": "ACTIVE",
    "leaderId": "550e8400-e29b-41d4-a716-446655440001",
    "leader": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "fullName": "Phạm Văn C",
      "email": "leader@example.com"
    },
    "memberCount": 5,
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### 5.3 Create Rescue Team

- **Method:** `POST`
- **Endpoint:** `/api/rescue-teams`
- **Auth Required:** ✅ Yes (Admin)
- **Description:** Tạo đội cứu hộ mới

**Request:**

```json
{
  "name": "Đội Cứu Hộ 2",
  "description": "Đội chuyên cứu hộ y tế",
  "leaderId": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Rescue team created successfully"
}
```

---

### 5.4 Update Team Status

- **Method:** `PUT`
- **Endpoint:** `/api/rescue-teams/{teamId}/status/{newStatus}`
- **Auth Required:** ✅ Yes (Dispatcher, Admin)
- **Description:** Cập nhật trạng thái đội (ACTIVE, INACTIVE, ON_DUTY, OFF_DUTY)

**Path Parameters:**

```
newStatus: ACTIVE | INACTIVE | ON_DUTY | OFF_DUTY
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cập nhật trạng thái thành công"
}
```

---

### 5.5 Delete Rescue Team

- **Method:** `DELETE`
- **Endpoint:** `/api/rescue-teams/{teamId}`
- **Auth Required:** ✅ Yes (Admin)
- **Description:** Xóa đội cứu hộ (soft delete)

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Rescue team deleted successfully"
}
```

---

### 5.6 Get Team Members

- **Method:** `GET`
- **Endpoint:** `/api/rescue-teams/{teamId}/members`
- **Auth Required:** ✅ Yes
- **Description:** Lấy danh sách thành viên của đội

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Get members of rescue team successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440001",
      "teamId": "550e8400-e29b-41d4-a716-446655440000",
      "joinDate": "2025-01-15T10:30:00Z",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "fullName": "Phạm Văn C",
        "email": "rescuer@example.com",
        "phoneNumber": "0912345678"
      }
    }
  ]
}
```

---

### 5.7 Add Member to Team

- **Method:** `POST`
- **Endpoint:** `/api/rescue-teams/{teamId}/member/{memberId}`
- **Auth Required:** ✅ Yes (Team Leader, Admin)
- **Description:** Thêm thành viên vào đội

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Thêm thành viên thành công"
}
```

---

### 5.8 Remove Member from Team

- **Method:** `DELETE`
- **Endpoint:** `/api/rescue-teams/{teamId}/member/{memberId}`
- **Auth Required:** ✅ Yes (Team Leader, Admin)
- **Description:** Xóa thành viên khỏi đội

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Xóa thành viên thành công"
}
```

---

### 5.9 Get Team Missions

- **Method:** `GET`
- **Endpoint:** `/api/rescue-teams/{teamId}/missions`
- **Auth Required:** ✅ Yes
- **Description:** Lấy danh sách nhiệm vụ của đội

**Query Parameters:**

```
?pageNumber=1&pageSize=10&status=IN_PROGRESS
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Get missions of rescue team successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "requestId": "550e8400-e29b-41d4-a716-446655440002",
      "dispatcherId": "550e8400-e29b-41d4-a716-446655440003",
      "rescueTeamId": "550e8400-e29b-41d4-a716-446655440000",
      "status": "IN_PROGRESS",
      "startTime": "2025-01-15T10:30:00Z",
      "endTime": null,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

## 6. Missions

### 6.1 Create Mission

- **Method:** `POST`
- **Endpoint:** `/api/missions`
- **Auth Required:** ✅ Yes (Dispatcher)
- **Description:** Tạo nhiệm vụ mới (gán đội cho request)

**Request:**

```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "dispatcherId": "550e8400-e29b-41d4-a716-446655440001",
  "rescueTeamId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Create mission successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003"
  }
}
```

---

### 6.2 Get Mission by ID

- **Method:** `GET`
- **Endpoint:** `/api/missions/{missionId}`
- **Auth Required:** ✅ Yes (Dispatcher, Rescuer)
- **Description:** Lấy chi tiết nhiệm vụ

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Get mission details successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "requestId": "550e8400-e29b-41d4-a716-446655440000",
    "request": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "emergencyType": "FIRE",
      "description": "Cháy nhà tại số 123 đường Lê Lợi"
    },
    "dispatcherId": "550e8400-e29b-41d4-a716-446655440001",
    "dispatcher": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "fullName": "Trần Văn B"
    },
    "rescueTeamId": "550e8400-e29b-41d4-a716-446655440002",
    "rescueTeam": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Đội Cứu Hộ 1"
    },
    "status": "IN_PROGRESS",
    "startTime": "2025-01-15T10:30:00Z",
    "endTime": null,
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### 6.3 Get All Missions (Pagination)

- **Method:** `GET`
- **Endpoint:** `/api/missions`
- **Auth Required:** ✅ Yes (Dispatcher)
- **Description:** Lấy danh sách nhiệm vụ (có phân trang)

**Query Parameters:**

```
?pageNumber=1&pageSize=10&status=IN_PROGRESS
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Get missions successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "requestId": "550e8400-e29b-41d4-a716-446655440000",
      "rescueTeam": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Đội Cứu Hộ 1"
      },
      "dispatcher": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "fullName": "Trần Văn B"
      },
      "status": "IN_PROGRESS",
      "startTime": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### 6.4 Update Mission Status

- **Method:** `PUT`
- **Endpoint:** `/api/missions/{missionId}/status`
- **Auth Required:** ✅ Yes (Rescuer, Dispatcher)
- **Description:** Cập nhật trạng thái nhiệm vụ (ASSIGNED→EN_ROUTE→ON_SITE→IN_PROGRESS)

**Request:**

```json
{
  "status": "EN_ROUTE",
  "changedById": "550e8400-e29b-41d4-a716-446655440003",
  "note": "Đội đang di chuyển tới hiện trường"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Update mission successfully"
}
```

---

### 6.5 Finish Mission

- **Method:** `PUT`
- **Endpoint:** `/api/missions/{missionId}/finish`
- **Auth Required:** ✅ Yes (Rescuer, Dispatcher)
- **Description:** Đánh dấu nhiệm vụ hoàn thành

**Request:**

```json
{
  "changedById": "550e8400-e29b-41d4-a716-446655440003",
  "note": "Đã dập tắt cháy, không có thiệt hại người"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Finish mission successfully"
}
```

---

### 6.6 Abort Mission

- **Method:** `PUT`
- **Endpoint:** `/api/missions/{missionId}/abort`
- **Auth Required:** ✅ Yes (Rescuer, Dispatcher)
- **Description:** Hủy nhiệm vụ

**Request:**

```json
{
  "changedById": "550e8400-e29b-41d4-a716-446655440003",
  "note": "Người gọi đã xử lý, không cần hỗ trợ"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Abort mission successfully"
}
```

---

### 6.7 Get Mission History

- **Method:** `GET`
- **Endpoint:** `/api/missions/{missionId}/history`
- **Auth Required:** ✅ Yes
- **Description:** Lấy lịch sử thay đổi trạng thái nhiệm vụ (Timeline)

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy lịch sử nhiệm vụ thành công",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "missionId": "550e8400-e29b-41d4-a716-446655440003",
      "fromStatus": "ASSIGNED",
      "toStatus": "EN_ROUTE",
      "changedById": "550e8400-e29b-41d4-a716-446655440003",
      "note": "Đội đang di chuyển tới hiện trường",
      "changedBy": {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "fullName": "Phạm Văn C"
      },
      "createdAt": "2025-01-15T10:35:00Z"
    }
  ]
}
```

---

## 7. Reports

### 7.1 Create Report

- **Method:** `POST`
- **Endpoint:** `/api/reports`
- **Auth Required:** ✅ Yes (Rescuer, Dispatcher)
- **Description:** Tạo báo cáo cho nhiệm vụ

**Request:**

```json
{
  "missionId": "550e8400-e29b-41d4-a716-446655440003",
  "createdById": "550e8400-e29b-41d4-a716-446655440003",
  "content": "Đã dập tắt cháy tại tầng 2, không có người bị thương",
  "type": "SUMMARY",
  "outcome": "SUCCESS",
  "injuries": "Không có",
  "damages": "Thiệt hại khoảng 5 triệu đồng",
  "latitude": 21.0285,
  "longitude": 105.8542,
  "note": "Cần theo dõi tình hình sau này"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Report created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440004"
  }
}
```

---

### 7.2 Get All Reports

- **Method:** `GET`
- **Endpoint:** `/api/reports`
- **Auth Required:** ✅ Yes (Dispatcher, Admin)
- **Description:** Lấy danh sách tất cả báo cáo

**Query Parameters:**

```
?pageNumber=1&pageSize=10&type=SUMMARY&outcome=SUCCESS
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Get reports successfully",
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440004",
        "missionId": "550e8400-e29b-41d4-a716-446655440003",
        "mission": {
          "id": "550e8400-e29b-41d4-a716-446655440003",
          "status": "COMPLETED"
        },
        "createdById": "550e8400-e29b-41d4-a716-446655440003",
        "createdBy": {
          "id": "550e8400-e29b-41d4-a716-446655440003",
          "fullName": "Phạm Văn C"
        },
        "content": "Đã dập tắt cháy tại tầng 2, không có người bị thương",
        "type": "SUMMARY",
        "outcome": "SUCCESS",
        "injuries": "Không có",
        "damages": "Thiệt hại khoảng 5 triệu đồng",
        "createdAt": "2025-01-15T11:30:00Z"
      }
    ],
    "totalCount": 50,
    "totalPages": 5,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

---

### 7.3 Get Report by ID

- **Method:** `GET`
- **Endpoint:** `/api/reports/{reportId}`
- **Auth Required:** ✅ Yes
- **Description:** Lấy chi tiết báo cáo

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Get report successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "missionId": "550e8400-e29b-41d4-a716-446655440003",
    "mission": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "status": "COMPLETED",
      "rescueTeam": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Đội Cứu Hộ 1"
      }
    },
    "createdById": "550e8400-e29b-41d4-a716-446655440003",
    "createdBy": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "fullName": "Phạm Văn C",
      "email": "rescuer@example.com"
    },
    "content": "Đã dập tắt cháy tại tầng 2, không có người bị thương",
    "type": "SUMMARY",
    "outcome": "SUCCESS",
    "injuries": "Không có",
    "damages": "Thiệt hại khoảng 5 triệu đồng",
    "latitude": 21.0285,
    "longitude": 105.8542,
    "note": "Cần theo dõi tình hình sau này",
    "createdAt": "2025-01-15T11:30:00Z",
    "updatedAt": "2025-01-15T11:30:00Z"
  }
}
```

---

### 7.4 Update Report

- **Method:** `PUT`
- **Endpoint:** `/api/reports/{reportId}`
- **Auth Required:** ✅ Yes (Creator or Admin)
- **Description:** Cập nhật báo cáo

**Request:**

```json
{
  "content": "Đã dập tắt cháy tại tầng 2, không có người bị thương (cập nhật lúc 12:00)",
  "outcome": "SUCCESS",
  "injuries": "Không có",
  "damages": "Thiệt hại khoảng 5 triệu đồng",
  "note": "Đã cập nhật sau kiểm tra lại"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Report updated successfully"
}
```

---

### 7.5 Delete Report

- **Method:** `DELETE`
- **Endpoint:** `/api/reports/{reportId}`
- **Auth Required:** ✅ Yes (Creator or Admin)
- **Description:** Xóa báo cáo

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Report deleted successfully"
}
```

---

### 7.6 Export Report to PDF

- **Method:** `GET`
- **Endpoint:** `/api/reports/{reportId}/export-pdf`
- **Auth Required:** ✅ Yes
- **Description:** Xuất báo cáo thành file PDF

**Response:** (File PDF)

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="report_550e8400_2025-01-15.pdf"
```

---

### 7.7 Get Reports by Mission

- **Method:** `GET`
- **Endpoint:** `/api/reports/mission/{missionId}`
- **Auth Required:** ✅ Yes
- **Description:** Lấy tất cả báo cáo của 1 nhiệm vụ

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Get mission reports successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "content": "Đã dập tắt cháy...",
      "outcome": "SUCCESS",
      "createdBy": {
        "fullName": "Phạm Văn C"
      },
      "createdAt": "2025-01-15T11:30:00Z"
    }
  ]
}
```

---

## 8. Contacts

### 8.1 Create Contact

- **Method:** `POST`
- **Endpoint:** `/api/auth/contact`
- **Auth Required:** ✅ Yes
- **Description:** Thêm liên hệ khẩn cấp cho người dùng

**Request:**

```json
{
  "name": "Nguyễn Văn B",
  "phone": "0987654321",
  "relationship": "Brother"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Tao contact thanh cong",
  "data": "550e8400-e29b-41d4-a716-446655440005"
}
```

---

### 8.2 Get All Contacts

- **Method:** `GET`
- **Endpoint:** `/api/auth/contact`
- **Auth Required:** ✅ Yes
- **Description:** Lấy danh sách liên hệ khẩn cấp

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lay thong tin thanh cong",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "name": "Nguyễn Văn B",
      "phone": "0987654321",
      "relationship": "Brother",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### 8.3 Get Contact by ID

- **Method:** `GET`
- **Endpoint:** `/api/auth/contact/{contactId}`
- **Auth Required:** ✅ Yes
- **Description:** Lấy chi tiết liên hệ

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lay thong tin thanh cong",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "name": "Nguyễn Văn B",
    "phone": "0987654321",
    "relationship": "Brother",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### 8.4 Update Contact

- **Method:** `PUT`
- **Endpoint:** `/api/auth/contact/{contactId}`
- **Auth Required:** ✅ Yes
- **Description:** Cập nhật liên hệ

**Request:**

```json
{
  "name": "Nguyễn Văn B Updated",
  "phone": "0987654321",
  "relationship": "Brother"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cap nhat thong tin thanh cong"
}
```

---

### 8.5 Delete Contact

- **Method:** `DELETE`
- **Endpoint:** `/api/auth/contact/{contactId}`
- **Auth Required:** ✅ Yes
- **Description:** Xóa liên hệ

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Xoa thanh cong"
}
```

---

## 9. Roles

### 9.1 Create Role

- **Method:** `POST`
- **Endpoint:** `/api/roles`
- **Auth Required:** ✅ Yes (Admin)
- **Description:** Tạo role mới

**Request:**

```json
{
  "name": "RescuerLeader",
  "description": "Leader của một đội cứu hộ"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Create role successfully"
}
```

---

### 9.2 Get All Roles

- **Method:** `GET`
- **Endpoint:** `/api/roles`
- **Auth Required:** ✅ Yes (Admin)
- **Description:** Lấy danh sách tất cả role

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Get roles successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Admin",
      "description": "Quản trị viên"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Dispatcher",
      "description": "Người điều phối"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Rescuer",
      "description": "Người cứu hộ"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "RescuerLeader",
      "description": "Leader của đội cứu hộ"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "name": "User",
      "description": "Người dùng bình thường"
    }
  ]
}
```

---

### 9.3 Get Role by ID

- **Method:** `GET`
- **Endpoint:** `/api/roles/{roleId}`
- **Auth Required:** ✅ Yes (Admin)
- **Description:** Lấy chi tiết role

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Get role successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Dispatcher",
    "description": "Người điều phối"
  }
}
```

---

### 9.4 Update Role

- **Method:** `PUT`
- **Endpoint:** `/api/roles/{roleId}`
- **Auth Required:** ✅ Yes (Admin)
- **Description:** Cập nhật role

**Request:**

```json
{
  "name": "Dispatcher",
  "description": "Người điều phối cứu hộ (Updated)"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Update role successfully"
}
```

---

### 9.5 Delete Role

- **Method:** `DELETE`
- **Endpoint:** `/api/roles/{roleId}`
- **Auth Required:** ✅ Yes (Admin)
- **Description:** Xóa role

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Delete role successfully"
}
```

---

## 🔐 Error Responses

### 400 - Bad Request

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Email format is invalid"
    }
  ]
}
```

### 401 - Unauthorized

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized - Invalid or expired token"
}
```

### 403 - Forbidden

```json
{
  "success": false,
  "statusCode": 403,
  "message": "Forbidden - Insufficient permissions"
}
```

### 404 - Not Found

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 - Internal Server Error

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Exception details"
}
```

---

## 📝 Common Status Values

### Request Status

- `PENDING` - Chờ xử lý
- `ACCEPTED` - Đã chấp nhận
- `IN_PROGRESS` - Đang xử lý
- `COMPLETED` - Hoàn thành
- `CANCELED` - Bị hủy
- `REJECTED` - Bị từ chối

### Mission Status

- `ASSIGNED` - Được phân công
- `EN_ROUTE` - Đang di chuyển tới
- `ON_SITE` - Đã tới hiện trường
- `IN_PROGRESS` - Đang cứu hộ
- `COMPLETED` - Hoàn thành
- `ABORTED` - Bị hủy

### Team Status

- `ACTIVE` - Hoạt động
- `INACTIVE` - Không hoạt động
- `ON_DUTY` - Đang làm việc
- `OFF_DUTY` - Ngoài giờ

### Priority

- `CRITICAL` (1) - Cấp độ 1 - Khẩn cấp
- `HIGH` (2) - Cấp độ 2 - Cao
- `MEDIUM` (3) - Cấp độ 3 - Trung bình
- `LOW` (4) - Cấp độ 4 - Thấp

### Emergency Type

- `FIRE` - Cháy
- `FLOOD` - Lũ
- `EARTHQUAKE` - Động đất
- `MEDICAL_EMERGENCY` - Cấp cứu y tế
- `TRAFFIC_EMERGENCY` - Tai nạn giao thông
- `BUILDING_COLLAPSE` - Sập nhà
- `NATURAL_DISASTER` - Thảm họa thiên nhiên
- `OTHER` - Khác

---

## 🔑 Authentication Token Example

**JWT Token Structure:**

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "fullName": "Nguyễn Văn A",
  "role": ["User", "Rescuer"],
  "exp": 1642339200,
  "iat": 1642252800
}
```

**Usage in Request:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJleHAiOjE2NDIzMzkyMDB9.signature
```

---

## 📞 Support & Notes

- **Base URL:** `http://localhost:5000/api`
- **API Version:** v1.0
- **Response Format:** JSON
- **Date Format:** ISO 8601 (UTC)
- **Pagination:** Default pageSize = 10
- **Rate Limit:** 100 requests per minute per IP

---

**Document Version:** 1.0  
**Last Updated:** January 2025
