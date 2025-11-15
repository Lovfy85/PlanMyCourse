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

## API Endpoints

Base URL: `http://localhost:3001`

### Courses

- `GET /courses` - Get all courses
- `GET /courses/search?term={searchTerm}` - Search courses by name, subject or level
- `GET /courses/id/:id` - Get course by ID
- `GET /courses/name/:name` - Get course by class name
- `GET /sort/alphabetical` - Get courses and order them alphabetically by their course name.
- `GET /sort/number` - Get courses and order them by their course number.
- `GET /sort/taken` - Get courses and orders alphabetically where it shows that of the taken courses first and the untaken ones below it.

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

### Authentication

- `POST /auth/signup` - Create a new user account (signup)
  - Body: `{ "username": "string", "password": "string" }`
- `POST /auth/login` - Authenticate user
  - Body: `{ "username": "string", "password": "string" }`

## Response Codes

- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid request
- `500 Internal Server Error` - Server/database error
