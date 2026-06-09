# API Endpoints

Base URL: `http://localhost:5000/api`

---

## Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Create a new user |
| POST | `/auth/login` | No | Login and get JWT token |
| GET | `/auth/me` | Yes | Get current authenticated user |

### POST `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

**Response (201):**
```json
{
  "token": "eyJ...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

### POST `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

**Response (200):**
```json
{
  "token": "eyJ...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

### GET `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

## Attendance (all require Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/attendance/mark` | Mark attendance for a date |
| GET | `/attendance/stats` | Get attendance stats |
| GET | `/attendance/recent` | Get last 5 attendance records |
| GET | `/attendance/all` | Get all attendance records |

**Headers for all:** `Authorization: Bearer <token>`

### POST `/attendance/mark`

**Body:**
```json
{
  "date": "2026-06-10",
  "status": "present",
  "reason": ""
}
```
`status`: `"present"` or `"absent"`

### GET `/attendance/stats`

**Response:**
```json
{
  "total": 10,
  "present": 9,
  "absent": 1,
  "percentage": 90
}
```

### GET `/attendance/recent`

**Response:** Array of last 5 attendance records sorted by date desc.

### GET `/attendance/all`

**Response:** Array of all attendance records sorted by date desc.

---

## Seed Data (test accounts)

| Name | Email | Password |
|------|-------|----------|
| Alice Johnson | alice@example.com | password123 |
| Bob Smith | bob@example.com | password123 |
| Charlie Brown | charlie@example.com | password123 |
| Diana Prince | diana@example.com | password123 |
