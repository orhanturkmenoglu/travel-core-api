# 🌍 TravelCore API

A modern **Travel Backend API** built with **Node.js & Express**.  
Designed for scalable travel, booking, and user management systems.

---

## ✨ Features

- JWT Authentication & Role-based Access
- User & Admin Management
- Travel Destinations & Bookings
- Request Validation (Joi)
- Centralized Error Handling
- Clean Service–Controller Architecture

---

## 🛠 Tech Stack

- Node.js · Express.js
- MongoDB · Mongoose
- JWT · bcryptjs · Joi

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd travel-core-api/backend/src
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables. Create a `.env` file in the `backend/src` directory with the following:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm run server
   ```

The API will be available at `http://localhost:3000`.

## 📄 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
Most endpoints require authentication via JWT token in cookies. Include `access_token` cookie after login.

### Endpoints

#### Authentication

##### Register User
- **Method:** `POST`
- **Path:** `/auth/register`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "StrongPass123!"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "username": "johndoe",
      "email": "john@example.com",
      "role": "USER",
      "_id": "user_id",
      "createdAt": "2025-12-21T00:00:00.000Z",
      "updatedAt": "2025-12-21T00:00:00.000Z"
    }
  }
  ```

##### Login User
- **Method:** `POST`
- **Path:** `/auth/login`
- **Description:** Login a user and set JWT cookie.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "StrongPass123!"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "User login successfully",
    "data": {
      "id": "user_id",
      "email": "john@example.com",
      "username": "johndoe"
    }
  }
  ```

#### Users

##### Get Profile
- **Method:** `GET`
- **Path:** `/users/getUsers`
- **Auth:** Required
- **Description:** Get current user's profile.
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "User fetched successfully",
    "user": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2025-12-21T00:00:00.000Z",
      "updatedAt": "2025-12-21T00:00:00.000Z"
    }
  }
  ```

##### Update User Role (Admin Only)
- **Method:** `PATCH`
- **Path:** `/users/:id/role`
- **Auth:** Required (Admin)
- **Description:** Update a user's role.
- **Request Body:**
  ```json
  {
    "role": "ADMIN"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "User role updated successfully",
    "data": {
      "userId": "user_id",
      "role": "ADMIN"
    }
  }
  ```

#### Travel Stories

##### Create Travel Story
- **Method:** `POST`
- **Path:** `/travels`
- **Auth:** Required
- **Description:** Create a new travel story. Image is uploaded to Cloudinary.
- **Request Body:**
  ```json
  {
    "title": "My Trip to Paris",
    "story": "It was an amazing experience...",
    "location": {
      "country": "France",
      "city": "Paris",
      "place": "Eiffel Tower"
    },
    "travelDate": "2025-06-15",
    "imageUrl": "https://example.com/image.jpg",
    "tags": ["europe", "paris"],
    "rating": 5
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Travel story created successfully",
    "travelStory": {
      "_id": "story_id",
      "title": "My Trip to Paris",
      "story": "It was an amazing experience...",
      "location": {
        "country": "France",
        "city": "Paris",
        "place": "Eiffel Tower"
      },
      "travelDate": "2025-06-15T00:00:00.000Z",
      "imageUrl": "cloudinary_url",
      "tags": ["europe", "paris"],
      "author": "user_id",
      "status": "PUBLISHED",
      "rating": 5,
      "createdAt": "2025-12-21T00:00:00.000Z",
      "updatedAt": "2025-12-21T00:00:00.000Z"
    }
  }
  ```

##### Get Travel Stories
- **Method:** `GET`
- **Path:** `/travels`
- **Auth:** Required
- **Description:** Get user's travel stories with optional filters.
- **Query Params:** `status` (PUBLISHED/ARCHIVED), `minRating`, `maxRating`, `page`, `limit`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Travel stories retrieved successfully",
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "totalCount": 1
    },
    "data": [
      {
        "_id": "story_id",
        "title": "My Trip to Paris",
        "story": "It was an amazing experience...",
        "location": {
          "country": "France",
          "city": "Paris",
          "place": "Eiffel Tower"
        },
        "travelDate": "2025-06-15T00:00:00.000Z",
        "imageUrl": "cloudinary_url",
        "tags": ["europe", "paris"],
        "author": "user_id",
        "status": "PUBLISHED",
        "rating": 5,
        "createdAt": "2025-12-21T00:00:00.000Z",
        "updatedAt": "2025-12-21T00:00:00.000Z"
      }
    ]
  }
  ```

##### Search Travel Stories by Title
- **Method:** `GET`
- **Path:** `/travels/search`
- **Auth:** None (Public)
- **Description:** Search published travel stories by title.
- **Query Params:** `title`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Travel stories matching title \"paris\" retrieved successfully",
    "data": [
      {
        "_id": "story_id",
        "title": "My Trip to Paris",
        "story": "It was an amazing experience...",
        "location": {
          "country": "France",
          "city": "Paris",
          "place": "Eiffel Tower"
        },
        "travelDate": "2025-06-15T00:00:00.000Z",
        "imageUrl": "cloudinary_url",
        "tags": ["europe", "paris"],
        "author": "user_id",
        "status": "PUBLISHED",
        "rating": 5,
        "createdAt": "2025-12-21T00:00:00.000Z",
        "updatedAt": "2025-12-21T00:00:00.000Z"
      }
    ]
  }
  ```

##### Get User Favorite Travel Stories
- **Method:** `GET`
- **Path:** `/travels/favorites`
- **Auth:** Required
- **Description:** Toggle favorite status for a travel story.
- **Query Params:** `travelId`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Travel story added to favorites",
    "data": {
      "travelId": "story_id",
      "isFavorite": true
    }
  }
  ```

##### Archive Travel Story
- **Method:** `PATCH`
- **Path:** `/travels/:travelId/archive`
- **Auth:** Required
- **Description:** Archive a travel story.
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Travel story archived successfully",
    "data": {
      "id": "story_id",
      "status": "ARCHIVED"
    }
  }
  ```

##### Delete Travel Story (Admin Only)
- **Method:** `DELETE`
- **Path:** `/travels/:travelId`
- **Auth:** Required (Admin)
- **Description:** Delete a travel story.
- **Response (204):**
  ```json
  {
    "success": true,
    "message": "Travel story deleted successfully"
  }
  ```

## 🔄 API Flow Examples

### User Registration and Login Flow
1. **Register:** POST `/auth/register` with user details.
2. **Login:** POST `/auth/login` to get JWT token in cookies.
3. **Access Protected Routes:** Use the token for authenticated requests.

### Creating and Managing Travel Stories
1. **Create Story:** POST `/travels` with story data (image uploaded to Cloudinary).
2. **View Stories:** GET `/travels` to list user's stories.
3. **Search Public Stories:** GET `/travels/search?title=paris`.
4. **Favorite/Unfavorite:** GET `/travels/favorites?travelId=story_id`.
5. **Archive:** PATCH `/travels/:travelId/archive`.
6. **Delete (Admin):** DELETE `/travels/:travelId`.

## 🧪 Testing the API

Use tools like Postman or curl to test endpoints. Ensure to include cookies for authenticated requests.

Example curl for login:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"StrongPass123!"}' \
  -c cookies.txt
```

Then use `-b cookies.txt` for subsequent requests.
