# Bug Tracker

A collaborative bug tracking system built with Next.js, TypeScript, Supabase, and Tailwind CSS.

---

# Setup & Run Instructions

## 1. Clone the repository

```bash
git clone https://github.com/gowthampati/bug-tracker.git
cd bug-tracker
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These values can be found in:

```txt
Supabase Dashboard → Project Settings → API
```

---

## 4. Run the development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

# Tech Stack & Rationale

## Frontend

### Next.js
Used for:
- Component-based frontend development
- Routing
- Dynamic pages
- Client-side interactivity
- Fast development workflow

Next.js was chosen because it provides an efficient React-based full-stack environment suitable for rapid prototyping and hackathon development.

---

### TypeScript
Used for:
- Type safety
- Better maintainability
- Preventing runtime bugs
- Safer handling of relational data structures

TypeScript improved development reliability while working with bugs, comments, and activity logs.

---

### Tailwind CSS
Used for:
- Fast UI styling
- Utility-first responsive design
- Rapid prototyping

Tailwind enabled quick iteration during the limited development time.

---

# Backend / Storage Layer

## Supabase

Used for:
- PostgreSQL database
- Authentication
- Auto-generated REST APIs
- Session management
- Persistent storage

Supabase was selected because it eliminated the need to manually build backend APIs, authentication infrastructure, password hashing, and database hosting.

Supabase internally handles:
- Password hashing
- Authentication sessions
- CRUD APIs
- PostgreSQL persistence

---

# Authentication & Password Hashing

Authentication is implemented using Supabase Auth with email-password login.

Supabase securely handles:
- Password hashing
- Session tokens
- User authentication
- Secure credential storage

Passwords are never stored in plaintext.

---

# Architectural Overview

## High-Level Architecture

```txt
Next.js Frontend
        ↓
Supabase SDK/API
        ↓
Supabase Backend Services
        ↓
PostgreSQL Database
```

---

# Project Structure

## app/login/page.tsx
Handles user authentication.

## app/register/page.tsx
Handles new user registration.

## app/bugs/page.tsx
Main dashboard containing:
- bug listing
- filtering
- sorting
- pagination
- workflow transitions
- comments
- activity logs
- assignment management

## app/bugs/[id]/page.tsx
Dedicated bug detail page.

## lib/supabase.ts
Supabase client configuration.

## lib/workflow.ts
Defines valid workflow status transitions.

---

# Features Implemented

## Authentication
- User registration
- User login
- User logout
- Protected authenticated routes

---

## Bug Management
- Create bugs
- Edit bugs
- Delete bugs
- View bug details
- Assign bugs
- Workflow status transitions

---

# Workflow Rules

Supported transitions:

```txt
Open → In Progress
In Progress → Resolved
Resolved → Closed
Resolved → Open
Closed → Open
```

Invalid transitions are prevented in the UI.

---

# Comments
- Add comments
- Comment validation
- Author attribution
- Timestamp tracking

---

# Activity Log

Tracks:
- Status changes
- Priority changes
- Assignee changes
- Comment additions

Each log stores:
- actor
- action description
- timestamp

---

# Filtering / Search / Sorting

Implemented:
- Search by title
- Filter by priority
- Filter by status
- Combined filtering
- Sorting by:
  - created_at
  - updated_at
  - priority
- Ascending / descending sorting

---

# Pagination

Implemented using page-based querying with Supabase `.range()`.

---

# How AI Tools Were Used

AI assistants used:
- ChatGPT

AI assistance was used for:
- brainstorming architecture
- debugging Next.js issues
- improving workflow logic
- TypeScript fixes
- Supabase integration guidance
- UI iteration support

The final implementation involved:
- manual integration
- manual debugging
- manual schema adjustments
- manual testing
- custom workflow decisions

AI-generated suggestions were reviewed and edited before integration.

Several suggested implementations were modified or rejected to better fit the project requirements.

---

# Assumptions

- All authenticated users are trusted collaborators.
- Role-based access control is not required.
- Single-team usage model.
- Email-password authentication is sufficient.
- Real-time synchronization is outside current scope.

---

# Trade-offs

Given the 6-hour development constraint, the following were deliberately deprioritized:

- Advanced UI polish
- Real-time websocket updates
- Role-based permissions
- Notifications
- File attachments
- Rich-text comments
- Optimistic updates
- Advanced analytics/dashboarding

Priority was given to:
- correctness
- workflow enforcement
- persistence
- auditability
- authentication
- functional completeness

---

# Future Work

Possible future improvements:

- Real-time updates using Supabase Realtime
- Docker deployment support
- Role-based access control
- Labels/tags
- Mention system (@user)
- Email notifications
- Attachment uploads
- Rich markdown comments
- Better mobile responsiveness
- Server-side middleware protection
- Advanced dashboards and reporting
- Performance optimization for very large datasets

---

# Incremental Development

The repository includes incremental commits showing:
- authentication setup
- bug CRUD implementation
- workflow logic
- comments/activity logs
- filtering/sorting/pagination
- UI improvements
- detail page implementation

This demonstrates iterative development and feature progression.

---

# Optional Enhancements Included

- Workflow enforcement
- Activity audit trail
- Dynamic detail pages
- Multi-user attribution
- Pagination support

---

# Repository

GitHub Repository:

```txt
https://github.com/gowthampati/bug-tracker
```
