# Backend API Documentation

## Overview

RESTful API built with Express.js, Node.js and MySQL for course management, prerequisites, user management, and course planning.

## Setup

1. Install dependencies: `npm install`
2. Create `.env` file with database credentials:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASS=your_database_password
   DB_NAME=your_database_name
   DB_PORT=your_database_port

   JWT_SECRET=Really_Cool_Key
   ```
3. Ensure MySQL database has `Courses` and `Prerequisites` tables
4. Start server: `npm start` (runs on port 3001)

The `Users` and `CoursesAdded` tables are automatically created on server start.

## Database Tables

**Users**
- `userId` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `username` (VARCHAR)
- `password` (VARCHAR)

**CoursesAdded**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `courseId` (INT, FOREIGN KEY)
- `taken` (BOOLEAN, DEFAULT FALSE)
- `createdAt` (TIMESTAMP)

**Reviews**
-`reviewId` (INT, PRIMARY KEY, AUTO_INCREMENT)
-`post` (TEXT)
-`userId` (INT)
-`courseId` (INT)


## API Endpoints

Base URL: `http://localhost:3001`

### Courses

- `GET /courses` - Get all courses
- `GET /courses/search?term={searchTerm}` - Search courses by name, subject or level
- `GET /courses/id/:id` - Get course by ID
- `GET /courses/name/:name` - Get course by class name
- `GET /sort/alphabetical` - Get courses and order them alphabetically by their course name.
- `GET /sort/number` - Get courses and order them by their course number.
- `GET /sort/addedtoplanner` - Get courses and orders alphabetically where it shows that of the courses added to the planner first and the unadded ones below them.

### Prerequisites

- `GET /prerequisites` - Get all prerequisite relationships
- `GET /prerequisites/:course` - Get direct prerequisites for a course
- `GET /prerequisites/recurse/:course` - Get all prerequisites recursively

### Users

- `GET /users` - Get all users
- `GET /users/:userId` - Get user by ID
- `DELETE /users/:userId` - Delete user by ID

### Courses Added (Planner)

- `GET /coursesadded` - Get all courses in planner with full details
- `GET /coursesadded/:courseId` - Check if course exists in planner
  - Returns: `{"exists": true/false, "course": {...}}`
- `POST /coursesadded` - Add course to planner
  - Body: `{ "courseId": number, "taken": boolean }`
- `PUT /coursesadded/:id` - Update taken status
  - Body: `{ "taken": boolean }`
- `DELETE /coursesadded/:id` - Remove course from planner

## Reviews Made 
- `POST /reviewsmade/rating` - signed-in user can star rate that of a course (they cannot star rate course more than once. They must remove it first in order to rate the course again).
  - Headers: 
    Authorization: Bearer <Given Token Of User When Signed In>
    Content-Type: application/json
  - Body: `{"rating": number, "courseId": number}`
- `POST /reviewsmade/review`- signed-in user can leave a comment for that of a course.
  - Headers: 
    Authorization: Bearer <Given Token Of User When Signed In>
    Content-Type: application/json
  - Body: `{"rating": number, "post": string}`
- `GET /reviewsmade/rating/:courseId` - Gets that of ratings gotten by that of a specified course from its course id.
- `GET /reviewsmade/review/:courseId` - Gets that of review comment gotten by that of a specified course from its course id.
- `DELETE /reviewsmade/review:/reviewId` - Remove that of the review comment from a specified course made by a user that is currently logged in.
  -Headers:
    Authorization: Bearer <Given Token Of User When Signed In>
- `DELETE /reviewsmade/rating:/reviewId` - Remove that of the star rating from a specified course made by a user that is currently logged in.
  -Headers:
    Authorization: Bearer <Given Token Of User When Signed In>
- `GET /reviewsmade/rating` - Gets all that of star ratings made by all users for those courses that were star rated.
- `GET /reviewsmade/review` - Gets all that of review comments made by all users for those courses that were commented on.

### Authentication

- `POST /auth/signup` - Create a new user account (signup)
  - Body: `{ "username": "string", "password": "string" }`
- `POST /auth/login` - Authenticate user
  - Body: `{ "username": "string", "password": "string" }`
- `GET /auth/logout` - To log out user from the website
- `GET /auth/me` - To get that of the current user logged in the website.

## Response Codes

- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid request
- `500 Internal Server Error` - Server/database error
