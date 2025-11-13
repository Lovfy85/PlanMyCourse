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
- `GET /courses/:id` - Get course by ID
- `GET /courses/:name` - Get course by class name

### Prerequisites

- `GET /prerequisites` - Get all prerequisite relationships
- `GET /prerequisites/:course` - Get direct prerequisites for a course
- `GET /prerequisites/recurse/:course` - Get all prerequisites recursively

### Users

- `GET /users` - Get all users
- `GET /users/:userId` - Get user by ID
- `POST /users` - Create user
  - Body: `{ "username": "string", "password": "string" }`
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

## Response Codes

- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid request
- `500 Internal Server Error` - Server/database error
