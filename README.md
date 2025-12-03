# Task Manager - Full Stack Application

A complete CRUD task management application with a React frontend and Python FastAPI backend, using JSON file storage.

## Project Structure

\`\`\`
.
├── backend/
│   └── main.py              # FastAPI backend with CRUD endpoints
├── app/                     # Next.js app directory
│   └── page.tsx            # Main dashboard
├── components/             # React components
│   ├── task-form.tsx       # Task creation form
│   ├── task-list.tsx       # Task list display
│   ├── task-card.tsx       # Individual task card
│   └── task-stats.tsx      # Statistics dashboard
├── types/
│   └── task.ts             # TypeScript types
├── scripts/
│   └── setup_database.py   # Database initialization
├── tasks.json              # JSON data store
└── README.md
\`\`\`

## Features

- ✅ Create, Read, Update, Delete (CRUD) tasks
- ✅ Task filtering by status (To Do, In Progress, Done)
- ✅ Priority levels (1-5)
- ✅ Due dates
- ✅ Task descriptions
- ✅ Pagination support
- ✅ Input validation
- ✅ Error handling
- ✅ Clean, modern UI
- ✅ Responsive design

## Task Model

\`\`\`json
{
  "id": "uuid",
  "title": "string (1-200 chars)",
  "description": "string (max 1000 chars, optional)",
  "status": "todo | in_progress | done",
  "priority": 1 | 2 | 3 | 4 | 5,
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp",
  "due_date": "ISO 8601 date (optional)"
}
\`\`\`

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Install Python dependencies:**
   \`\`\`bash
   pip install fastapi uvicorn python-multipart
   \`\`\`

2. **Initialize the database:**
   \`\`\`bash
   python scripts/setup_database.py
   \`\`\`

3. **Start the backend server:**
   \`\`\`bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   \`\`\`

   The API will be available at `http://localhost:8000`

   API Documentation: `http://localhost:8000/docs` (Swagger UI)

### Frontend Setup

1. **Install Node dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure API endpoint:**
   Create a `.env.local` file in the project root:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:8000
   \`\`\`

3. **Start the frontend development server:**
   \`\`\`bash
   npm run dev
  
   \`\`\`

   The frontend will be available at `http://localhost:3000`

## API Endpoints

### GET /items
Get all tasks with optional filtering and pagination

**Query Parameters:**
- `status` (optional): Filter by status (todo, in_progress, done)
- `priority` (optional): Filter by priority (1-5)
- `skip` (optional): Number of items to skip (default: 0)
- `limit` (optional): Number of items to return (default: 10, max: 100)

**Example:**
\`\`\`bash
curl http://localhost:8000/items?status=todo&limit=20
\`\`\`

### POST /items
Create a new task

**Request Body:**
\`\`\`json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "todo",
  "priority": 3,
  "due_date": "2024-12-31"
}
\`\`\`

**Example:**
\`\`\`bash
curl -X POST http://localhost:8000/items \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","priority":3,"status":"todo"}'
\`\`\`

### GET /items/{id}
Get a specific task by ID

**Example:**
\`\`\`bash
curl http://localhost:8000/items/123e4567-e89b-12d3-a456-426614174000
\`\`\`

### PUT /items/{id}
Update a task

**Request Body (all fields optional):**
\`\`\`json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in_progress",
  "priority": 4,
  "due_date": "2024-12-31"
}
\`\`\`

**Example:**
\`\`\`bash
curl -X PUT http://localhost:8000/items/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'
\`\`\`

### DELETE /items/{id}
Delete a task

**Example:**
\`\`\`bash
curl -X DELETE http://localhost:8000/items/123e4567-e89b-12d3-a456-426614174000
\`\`\`

## Running Both Services

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
npm run dev
\`\`\`

Then open `http://localhost:3000` in your browser.

## Validation

### Frontend Validation
- Title is required and limited to 200 characters
- Description limited to 1000 characters
- Priority must be between 1-5
- Valid status values: todo, in_progress, done

### Backend Validation
- All inputs are validated before processing
- Detailed error messages for invalid requests
- Status validation (must be: todo, in_progress, or done)
- Priority validation (must be 1-5)
- Pagination limits enforced

## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK`: Successful GET/PUT request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Invalid input or validation error
- `404 Not Found`: Task not found
- `500 Internal Server Error`: Server error

Example error response:
\`\`\`json
{
  "detail": "Task not found"
}
\`\`\`

## Data Persistence

All tasks are stored in `tasks.json` file in the project root. This file is automatically created and managed by the backend. The JSON structure is:

\`\`\`json
{
  "tasks": [
    {
      "id": "...",
      "title": "...",
      ...
    }
  ]
}
\`\`\`

## Development Tips

- The frontend uses SWR for client-side state management
- The backend uses Pydantic for validation
- All timestamps are in ISO 8601 format with UTC timezone (Z suffix)
- CORS is enabled on the backend for frontend communication
- The database is human-readable JSON for easy inspection and debugging

## Future Enhancements

Optional features that could be added:
- User authentication and authorization
- Database migration to SQL (PostgreSQL, MySQL)
- Task categories/tags
- Recurring tasks
- Comments and activity logs
- File attachments
- Dark/light theme toggle
- Drag-and-drop task reordering
- Export to CSV/PDF

## License

MIT
