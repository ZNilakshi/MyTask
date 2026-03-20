# 📋 Task Manager App

A full-stack Task Manager web application built with **Angular** (frontend), **Spring Boot** (backend), and **MySQL** (database). Features JWT-based authentication and Docker support.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 21, Angular Material |
| Backend | Spring Boot 4, Java 21 |
| Database | MySQL 8 |
| Auth | JWT (JSON Web Tokens) |
| DevOps | Docker, Docker Compose |

---

## ✨ Features

- ✅ User Registration & Login with JWT Authentication
- ✅ Kanban Board (To Do / In Progress / Done)
- ✅ Create, Edit, Delete Tasks
- ✅ Filter Tasks by Status
- ✅ Task Detail Modal
- ✅ Confirm Dialog before Delete
- ✅ Toast Notifications
- ✅ Responsive Design
- ✅ User-scoped Tasks (each user sees only their own tasks)
- ✅ Dockerized Full Stack

---

## 🚀 Running with Docker 

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/ZNilakshi/MyTask.git
cd MyTask
```

**2. Create `.env` file in the root folder**
```bash
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_jwt_secret_minimum_32_characters_long
```

> You can copy from the example file:
> ```bash
> cp .env.example .env
> ```
> Then edit `.env` with your values.

**3. Start all services**
```bash
docker-compose up --build
```

**4. Access the app**

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8080 |
| MySQL | localhost:3307 |

**5. Stop the app**
```bash
docker-compose down
```

---

## 💻 Running Locally (Without Docker)

### Prerequisites
- Java 21+
- Node.js 20+
- MySQL 8
- Maven

### Backend Setup

**1. Create MySQL database**
```sql
CREATE DATABASE taskmanager_db;
```

**2. Configure `backend/src/main/resources/application.properties`**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanager_db
spring.datasource.username=root
spring.datasource.password=your_password

jwt.secret=your_jwt_secret_min_32_characters
jwt.expiration=86400000
```

**3. Run the backend**
```bash
cd backend
mvn spring-boot:run
```

Backend runs on → http://localhost:8080

---

### Frontend Setup

**1. Install dependencies**
```bash
cd frontend
npm install
```

**2. Run the frontend**
```bash
ng serve
```

Frontend runs on → http://localhost:4200

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Tasks (requires JWT token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get task by ID |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |

---

## 📁 Project Structure

```
MyTask/
├── backend/                        # Spring Boot API
│   ├── src/main/java/
│   │   └── com/treinetic/taskmanager/
│   │       ├── controller/         # REST Controllers
│   │       ├── service/            # Business Logic
│   │       ├── repository/         # Data Access
│   │       ├── model/              # Entities
│   │       ├── dto/                # Data Transfer Objects
│   │       ├── security/           # JWT Filter & Config
│   │       └── exception/          # Exception Handlers
│   ├── src/main/resources/
│   │   └── application.properties
│   └── Dockerfile
│
├── frontend/                       # Angular App
│   ├── src/app/
│   │   ├── components/             # UI Components
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── task-list/          # Kanban Board
│   │   │   ├── task-card/
│   │   │   ├── task-form/
│   │   │   └── confirm-dialog/
│   │   ├── services/               # API Services
│   │   ├── guards/                 # Auth Guard
│   │   ├── interceptors/           # JWT Interceptor
│   │   └── models/                 # TypeScript Interfaces
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔐 Authentication Flow

```
Register/Login → JWT Token → Store in LocalStorage
→ Attach to every API request (Authorization: Bearer <token>)
→ Spring Security validates token
→ Access granted to protected routes
```

---

## 🐳 Docker Services

| Container | Image | Port |
|-----------|-------|------|
| taskmanager-db | mysql:8.0 | 3307 |
| taskmanager-backend | custom | 8080 |
| taskmanager-frontend | nginx:alpine | 4200 |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_jwt_secret_minimum_32_characters_long
```

---

## 📸 Screenshots

### Login
![Login](https://raw.githubusercontent.com/ZNilakshi/MyTask/main/frontend/public/screenshots/login.png)

### Register
![Register](https://raw.githubusercontent.com/ZNilakshi/MyTask/main/frontend/public/screenshots/register.png)

### Dashboard
![Dashboard](https://raw.githubusercontent.com/ZNilakshi/MyTask/main/frontend/public/screenshots/dashboard1.png)

### Add New Task
![Add Task](https://raw.githubusercontent.com/ZNilakshi/MyTask/main/frontend/public/screenshots/addtask.png)

![Add Task](https://github.com/ZNilakshi/MyTask/blob/main/frontend/public/screenshots/add%20task.png)

### Dashboard with Tasks
![Dashboard with Tasks](https://raw.githubusercontent.com/ZNilakshi/MyTask/main/frontend/public/screenshots/dashboard2.png)

### View Details
![View Details](https://raw.githubusercontent.com/ZNilakshi/MyTask/main/frontend/public/screenshots/viewmore.png)

###  Delete Confirmation
![Delete Confirm](https://raw.githubusercontent.com/ZNilakshi/MyTask/main/frontend/public/screenshots/deleteconfirmation.png)

### Toast Notification
![Toast](https://raw.githubusercontent.com/ZNilakshi/MyTask/main/frontend/public/screenshots/notification.png)

---

## 👩‍💻 Author

**Nilakshie**  
GitHub: [@ZNilakshi](https://github.com/ZNilakshi)
