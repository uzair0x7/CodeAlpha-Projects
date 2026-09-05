
<div align="center">

# FlowBoard

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

> A full-stack project management and team collaboration platform inspired by tools like Trello and Asana.

FlowBoard is a modern project management application built with **React, Node.js, Express, and MongoDB**. It provides teams with a collaborative Kanban workspace where they can manage projects, assign tasks, track progress, communicate through comments, and receive real-time notifications.

The application uses **Socket.IO** for real-time communication and **JWT authentication with HTTP-only cookies** for secure user sessions.

---

## ✨ Features

### 🔐 Authentication

- User signup and login
- JWT-based authentication
- HTTP-only authentication cookies
- Secure logout
- Protected routes
- Authentication state management

### 📁 Project Management

- Create projects
- View projects
- Delete projects
- Project owner permissions
- Project-based access control
- Add and remove project members

### 👥 Team Collaboration

- Add members to projects
- Remove members from projects
- Assign tasks to team members
- Role-based permissions
- Project members can collaborate on shared tasks

### 📋 Kanban Board

FlowBoard uses a simple and intuitive Kanban workflow:

```text
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│     TODO     │    │  IN PROGRESS │    │     DONE     │
├──────────────┤    ├──────────────┤    ├──────────────┤
│   Task #1    │    │   Task #3    │    │   Task #5    │
│   Task #2    │    │   Task #4    │    │   Task #6    │
└──────────────┘    └──────────────┘    └──────────────┘
````

Features include:

* Drag-and-drop task movement
* Todo, In Progress, and Done columns
* Status change handling
* Status change confirmation modal
* Instant task status updates

### ✅ Task Management

Create and manage tasks with:

* Task title
* Description
* Status
* Priority
* Due date
* Assignee
* Creation and update information

Users can:

* Create tasks
* Edit tasks
* Delete tasks
* Assign tasks
* Change task status
* Set task priorities
* Set due dates
* View detailed task information

### 💬 Comments

Team members can communicate directly through task comments.

* Add comments
* Edit your own comments
* Delete your own comments
* Task-specific discussions
* Permission-based comment management

### ⚡ Real-Time Communication

FlowBoard uses **Socket.IO** to provide real-time events without requiring page refreshes.

Real-time functionality includes:

* Task assignment notifications
* Instant notification delivery
* Real-time communication between connected clients
* Socket-based user events

### 🔔 Notification System

FlowBoard provides multiple layers of notifications.

#### Browser Notifications

Users can receive persistent desktop/browser notifications when they are assigned tasks.

> Browser notification permission is required.

#### In-App Notifications

A notification modal appears inside the application and provides a simple **"Got it"** action.

#### Toast Notifications

Short-lived toast notifications provide immediate feedback without interrupting the user's workflow.

Toast deduplication prevents identical notifications from appearing repeatedly within a short time window.

### 🛡️ Role-Based Permissions

FlowBoard uses project-level permissions to control what users can do.

#### Project Owner

Project owners can:

* Edit tasks
* Delete tasks
* Add members
* Remove members
* Delete projects
* Manage project collaboration

#### Project Members

Project members can:

* View projects
* View tasks
* Move tasks between columns
* Change task status
* Add comments
* Edit their own comments
* Delete their own comments

Users must belong to a project before they can access its workspace.

### 📱 Responsive Interface

* Responsive layout
* Clean UI
* Raw CSS
* No Tailwind
* No component/UI libraries
* Functional React components
* Reusable components

---

# 🛠️ Tech Stack

## Frontend

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| React.js         | Frontend framework      |
| React Router     | Client-side navigation  |
| Socket.IO Client | Real-time communication |
| React Icons      | Icons                   |
| CSS              | Styling                 |

## Backend

| Technology        | Purpose                 |
| ----------------- | ----------------------- |
| Node.js           | Runtime                 |
| Express.js        | Backend framework       |
| MongoDB           | Database                |
| Mongoose          | MongoDB ODM             |
| JSON Web Token    | Authentication          |
| HTTP-only Cookies | Secure session storage  |
| Socket.IO         | Real-time communication |

---

# 🏗️ Architecture

FlowBoard follows a client-server architecture.

```text
                    ┌─────────────────────┐
                    │       Browser       │
                    │                     │
                    │      React.js       │
                    │    React Router     │
                    │   Socket.IO Client  │
                    └──────────┬──────────┘
                               │
                       HTTP / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Express.js     │
                    │                     │
                    │   Authentication    │
                    │     Middleware      │
                    │      REST API       │
                    └──────┬───────┬──────┘
                           │       │
                    MongoDB│       │Socket.IO
                           │       │
                           ▼       ▼
                    ┌──────────┐  ┌──────────┐
                    │ MongoDB  │  │  Socket  │
                    │ Database │  │   Server │
                    └──────────┘  └──────────┘
```

---

# 📁 Project Structure

```text
project-management-tool/
│
├── backend/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Comment.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   ├── comments.js
│   │   └── members.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   │
│   └── socket/
│       └── index.js
│
├── frontend/
│   ├── package.json
│   │
│   ├── public/
│   │   └── index.html
│   │
│   └── src/
│       ├── index.js
│       ├── App.js
│       ├── Router.js
│       ├── api.js
│       │
│       ├── context/
│       │   ├── AuthContext.js
│       │   └── SocketContext.js
│       │
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Signup.js
│       │   ├── Dashboard.js
│       │   ├── Board.js
│       │   └── TaskDetail.js
│       │
│       ├── components/
│       │   ├── TaskCard.js
│       │   ├── NotificationModal.js
│       │   └── other components
│       │
│       ├── utils/
│       │   ├── helpers.js
│       │   └── notifications.js
│       │
│       └── styles/
│           └── global.css
│
└── README.md
```

---

# ⚙️ Installation

## Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) v14 or later
* MongoDB or MongoDB Atlas
* npm or Yarn
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/uzair0x7/CodeAlpha-Projects.git

cd CodeAlpha-Projects
```

Navigate to the FlowBoard project directory if it is located inside the repository.

---

## 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/projectdb
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

### Environment Variables

| Variable     | Description                    |
| ------------ | ------------------------------ |
| `PORT`       | Backend server port            |
| `MONGO_URI`  | MongoDB connection string      |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `NODE_ENV`   | Application environment        |

Start the development server:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

---

# 3. Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

The frontend will be available at:

```text
http://localhost:3000
```

---

# 🔐 Authentication Flow

FlowBoard uses JWT authentication with HTTP-only cookies.

The authentication flow works approximately like this:

```text
User
 │
 │ Login
 ▼
React Frontend
 │
 │ POST /auth/login
 ▼
Express Backend
 │
 │ Validate credentials
 ▼
JWT Token Generated
 │
 │ HTTP-only Cookie
 ▼
Browser
 │
 │ Authenticated Requests
 ▼
Protected API Routes
```

Using HTTP-only cookies helps prevent client-side JavaScript from directly accessing the authentication token.

---

# ⚡ Real-Time Notification Flow

When a task is assigned to a user, FlowBoard uses Socket.IO to immediately notify the assignee.

```text
Project Owner
      │
      │ Assign Task
      ▼
Express API
      │
      │ Task Updated
      ▼
Socket.IO Server
      │
      │ Emit Event
      ▼
Assigned User
      │
      ├── Browser Notification
      │
      ├── In-App Modal
      │
      └── Toast Notification
```

Users do not need to refresh the page to receive task assignment notifications.

---

# 🔔 Notification Behavior

When a task is created or updated and assigned to a user:

1. The backend processes the task update.
2. Socket.IO emits an event to the assigned user.
3. The frontend receives the event.
4. A browser notification is displayed if permission has been granted.
5. An in-app notification modal appears.
6. A toast notification provides immediate feedback.
7. Duplicate notifications are filtered within a short time window.

---

# 👥 Roles & Permissions

| Action              | Project Owner | Project Member |
| ------------------- | :-----------: | :------------: |
| View Project        |       ✅       |        ✅       |
| View Tasks          |       ✅       |        ✅       |
| Create Tasks        |       ✅       |        ✅       |
| Edit Tasks          |       ✅       |        ❌       |
| Delete Tasks        |       ✅       |        ❌       |
| Change Task Status  |       ✅       |        ✅       |
| Assign Tasks        |       ✅       |        ❌       |
| Add Members         |       ✅       |        ❌       |
| Remove Members      |       ✅       |        ❌       |
| Delete Project      |       ✅       |        ❌       |
| Add Comments        |       ✅       |        ✅       |
| Edit Own Comments   |       ✅       |        ✅       |
| Delete Own Comments |       ✅       |        ✅       |

> Permissions are enforced according to the user's role within the project.

---

# 🧪 Testing Real-Time Features

You can test FlowBoard's real-time functionality using two browser sessions.

### Step 1 — Create User Accounts

Create two separate accounts:

```text
User A → Project Owner
User B → Project Member
```

### Step 2 — Create a Project

Log in as User A and create a project.

### Step 3 — Add User B

Add User B as a project member.

### Step 4 — Create a Task

Create a task and assign it to User B.

### Step 5 — Check User B

Keep User B logged in through another browser window or incognito session.

The assignment should trigger:

* Browser notification
* In-app notification modal
* Toast notification

All without manually refreshing the page.

---

# 🚀 Deployment

## Backend

For production deployment:

1. Set the environment to production.
2. Use a production MongoDB database.
3. Configure a secure JWT secret.
4. Configure production CORS and cookie settings.
5. Run the backend using a process manager such as PM2.

Example:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_secret
```

Start using PM2:

```bash
pm2 start server.js --name flowboard
```

---

## Frontend

Create a production build:

```bash
npm run build
```

The generated production files will be located inside:

```text
build/
```

The frontend can then be deployed using platforms such as:

* Vercel
* Netlify
* Nginx
* Any static hosting provider

Configure the frontend API URL to point toward your deployed backend.

---

# 🔒 Security Considerations

FlowBoard includes several security-focused implementation choices:

* JWT authentication
* HTTP-only cookies
* Protected API routes
* Authentication middleware
* Role-based authorization
* Project membership validation
* Owner-only project deletion
* Owner-only task management
* User-owned comment editing/deletion
* Environment variables for secrets

> Never commit your `.env` file or production secrets to version control.

Add the following to `.gitignore`:

```gitignore
node_modules/
.env
build/
dist/
```

---

# 🧩 Core Concepts

FlowBoard was built to demonstrate practical full-stack development concepts including:

* REST API design
* Authentication and authorization
* JWT-based sessions
* HTTP-only cookies
* MongoDB data modeling
* Mongoose
* React state management
* React Context
* Client-side routing
* Real-time communication
* WebSocket-based events
* Browser Notification API
* Role-based access control
* Drag-and-drop interfaces
* Responsive CSS
* Full-stack application architecture

---

# 🔮 Future Improvements

Potential future features include:

* [ ] Real-time comment updates
* [ ] Drag-and-drop column reordering
* [ ] Task search
* [ ] Task filtering
* [ ] Task attachments
* [ ] File uploads
* [ ] Activity logs
* [ ] Email notifications
* [ ] Project activity timeline
* [ ] User profile management
* [ ] Dark/light themes
* [ ] Task labels and tags
* [ ] Custom Kanban columns
* [ ] Advanced project analytics
* [ ] Team member presence indicators

---

# 📸 Screenshots

Add screenshots of the application here once available.

```text
screenshots/
├── dashboard.png
├── board.png
├── task-detail.png
├── notifications.png
└── authentication.png
```

Example:

```markdown
![Dashboard](https://github.com/uzair0x7/CodeAlpha-Projects/blob/main/CodeAlpha_Project_Management_Tool/screenshots/dashboard.png)

![Kanban Board](./screenshots/board.png)

![Task Details](./screenshots/task-detail.png)
```

---

# 📚 What I Learned

Building FlowBoard provided hands-on experience with:

* Designing and building a full-stack MERN application
* Implementing secure authentication
* Working with JWT and HTTP-only cookies
* Designing MongoDB schemas
* Building REST APIs with Express
* Implementing role-based permissions
* Managing application state with React
* Building reusable React components
* Implementing real-time communication with Socket.IO
* Working with browser notifications
* Building interactive Kanban boards
* Structuring a scalable full-stack project

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute the project according to the terms of the license.

---

# 👨‍💻 Author

## Uzair Ali

**Full Stack Developer · Computer Science Student**

### Links

* 🔗 **GitHub:** [https://github.com/uzair0x7/CodeAlpha-Projects](https://github.com/uzair0x7/CodeAlpha-Projects)
* 💼 **LinkedIn:** [https://www.linkedin.com/in/uzairdev1/](https://www.linkedin.com/in/uzairdev1/)

---

<p align="center">
  Built with React, Node.js, Express, MongoDB, and Socket.IO.
</p>

<p align="center">
  ⭐ If you found this project useful, consider giving the repository a star!
</p>

