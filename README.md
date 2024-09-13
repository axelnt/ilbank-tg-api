# ILBANK Technical Guideline API

## Overview

This API is designed to help the technical support team at ILBANK easily access and manage program details and related documentation. It makes it simpler for them to retrieve important guidelines and stay updated with the latest information, ensuring that everyone on the team has what they need to keep operations running smoothly. Please note that this API does not contain any data related to the company itself.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [API Endpoints](#api-endpoints)
    -   [Authentication Endpoint](#authentication-endpoint)
    -   [User Endpoints](#user-endpoints)
    -   [Program Endpoints](#program-endpoints)
    -   [Directorate Endpoints](#directorate-endpoints)
    -   [Department Endpoints](#department-endpoints)
    -   [Health Endpoint](#health-endpoint)
-   [Seeding Data](#seeding-data)
-   [Authentication](#authentication)
-   [Error Handling](#error-handling)

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/axelnt/ilbank-tg-api.git
```

Navigate to the project directory:

```bash
cd ilbank-tg-api
```

Create .env file: You can create the .env file by copying the .env.example file. Don't forget to change the values to match your environment.

```bash
cp .env.example .env
```

To install the necessary dependencies, run:

```bash
npm install
```

## Usage

To start the server, you can choose between development and production modes.

### Development Mode

To start the server in development mode, run:

```bash
npm run start:dev
```

This will start the server with hot-reloading enabled, allowing you to see changes in real-time.

### Production Mode

Make sure to build the project first if you haven't done so:

```bash
npm run build
```

Then, start the server in production mode:

```bash
npm run start
```

## API Endpoints

### Authentication Endpoint

| Method | URL           | Description | Required Fields        | Authentication Required |
| ------ | ------------- | ----------- | ---------------------- | ----------------------- |
| `POST` | `/auth/login` | Login       | `username`, `password` | No                      |

### User Endpoints

| Method   | URL           | Description       | Required Fields        | Authentication Required |
| -------- | ------------- | ----------------- | ---------------------- | ----------------------- |
| `GET`    | `/users`      | Get all users     |                        | Yes                     |
| `GET`    | `/users/{id}` | Get user by ID    |                        | Yes                     |
| `POST`   | `/users`      | Create a new user | `username`, `password` | Yes                     |
| `DELETE` | `/users/{id}` | Delete user by ID |                        | Yes                     |

### Program Endpoints

| Method   | URL              | Description          | Required Fields                                                | Authentication Required |
| -------- | ---------------- | -------------------- | -------------------------------------------------------------- | ----------------------- |
| `GET`    | `/programs`      | Get all programs     |                                                                | No                      |
| `GET`    | `/programs/{id}` | Get program by ID    |                                                                | No                      |
| `POST`   | `/programs`      | Create a program     | `name`, `directorates`, `departments`, `users`, `processBased` | Yes                     |
| `DELETE` | `/programs/{id}` | Delete program by ID |                                                                | Yes                     |

### Directorate Endpoints

| Method   | URL                  | Description              | Required Fields | Authentication Required |
| -------- | -------------------- | ------------------------ | --------------- | ----------------------- |
| `GET`    | `/directorates`      | Get all directorates     |                 | No                      |
| `GET`    | `/directorates/{id}` | Get directorate by ID    |                 | No                      |
| `POST`   | `/directorates`      | Create a directorate     | `name`          | Yes                     |
| `DELETE` | `/directorates/{id}` | Delete directorate by ID |                 | Yes                     |

### Department Endpoints

| Method   | URL                 | Description             | Required Fields | Authentication Required |
| -------- | ------------------- | ----------------------- | --------------- | ----------------------- |
| `GET`    | `/departments`      | Get all departments     |                 | No                      |
| `GET`    | `/departments/{id}` | Get department by ID    |                 | No                      |
| `POST`   | `/departments`      | Create a department     | `name`          | Yes                     |
| `DELETE` | `/departments/{id}` | Delete department by ID |                 | Yes                     |

### Health Endpoint

| Method | URL       | Description  |
| ------ | --------- | ------------ |
| `GET`  | `/health` | Health check |

## Seeding Data

To seed the database with initial data, run:

```bash
npm run seed
```

This will create a user with the credentials provided in the `.env` file. You can set the `ADMIN_USERNAME` and `ADMIN_PASSWORD` values in the `.env` file to customize the credentials.

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

You can use this user to authenticate and create more users, programs, directorates, and departments.

## Authentication

This API uses Bearer Token authentication. To authenticate, you need to send a `POST` request to `/auth/login` with the following payload:

```json
{
    "username": "your_username",
    "password": "your_password"
}
```

If the credentials are correct, you will receive a response with a token:

```json
{
    "status": "success",
    "data": {
        "token": "your_token"
    },
    "timestamp": "1726264321"
}
```

You can then use this token to authenticate your requests by adding it to the `Authorization` header:

```json
{
    "Authorization": "Bearer your_token"
}
```

Do not forget to include the `Bearer` keyword before the token.

## Error Handling

Errors are returned in a standard format:

```json
{
    "status": "error",
    "message": "error_message",
    "timestamp": "1726264321"
}
```
