# Phonebook Backend

A REST API for a phonebook application built with Node.js and Express, serving a React frontend. Built as part of the [Full Stack Open](https://fullstackopen.com) course (Part 3).

**Live demo:** https://phonebook-backend-varz.onrender.com

## Tech Stack

- **Node.js** + **Express** — server and routing
- **Mongoose** — MongoDB object modeling
- **Morgan** — HTTP request logging
- **CORS** — cross-origin resource sharing

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB connection URI (e.g. MongoDB Atlas)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/phonebookDB?retryWrites=true&w=majority
PORT=3001
```

### Running the app

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

The server runs on `http://localhost:3001` by default.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/persons` | Get all persons |
| GET | `/api/persons/:id` | Get a single person |
| POST | `/api/persons` | Add a new person |
| PUT | `/api/persons/:id` | Update a person's number |
| DELETE | `/api/persons/:id` | Delete a person |
| GET | `/info` | Phonebook entry count and server time |

### Example request body for POST / PUT

```json
{
  "name": "Ada Lovelace",
  "number": "39-44-5323523"
}
```

## MongoDB CLI Script

`mongo.js` is a standalone script for interacting with the database directly from the command line.

```bash
# List all entries
node mongo.js <password>

# Add a new entry
node mongo.js <password> "Name" "phone-number"
```

## Project Structure

```
phonebook-backend/
├── dist/          # Production build of the React frontend
├── requests/      # REST client files for manual API testing
├── index.js       # Express app and route definitions
├── mongo.js       # MongoDB CLI utility script
└── package.json
```
