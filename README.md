# Notik

A full-stack notes application built with the MERN stack, allowing users to create, manage, search, sort, and organize their notes.

## Features

* User Registration & Login
* Authentication & Protected Routes
* Create Notes
* Edit Notes
* Delete Notes
* Pin Notes
* Search Notes
* Sort Notes
* User Profile
* Light/Dark Theme
* Responsive UI

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Shadcn UI
* TanStack Query
* React Hook Form
* Zod
* Jest
* Testing Library

### Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcrypt
* Mocha
* Chai
* Sinon
* c8

### Code Quality

* SonarQube
* SonarLint
* ESLint
* Prettier

## Project Structure

```text
notik/
├── frontend/
├── backend/
├── sonar-project.properties
└── README.md
```

## Getting Started

### Prerequisites

* Node.js
* npm
* MongoDB
* Docker (for SonarQube)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd notik
```

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd backend
npm install
```

## Environment Variables

Create environment files according to the example files provided in the frontend and backend.

### Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_ORIGIN=
```

### Frontend

```env
VITE_API_URL=
```

## Running the Project

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

The frontend and backend can then be accessed through their configured local development URLs.

## Testing

### Frontend

Run all tests:

```bash
cd frontend
npm test
```

Run a specific test:

```bash
npm test -- FileName.test.tsx
```

### Backend

Run backend tests:

```bash
cd backend
npm test
```

Generate coverage:

```bash
npm run test:coverage
```

## SonarQube

Notik uses SonarQube for static code analysis and code-quality monitoring.

Start SonarQube using Docker:

```bash
docker run -d --name notik-sonarqube \
-p 9000:9000 \
sonarqube:lts-community
```

Create a SonarQube project and configure the required authentication token.

Run the scanner from the project root:

```powershell
docker run --rm `
--network notik-sonar-network `
-v "${PWD}:/usr/src" `
sonarsource/sonar-scanner-cli `
"-Dsonar.token=$env:SONAR_TOKEN"
```

SonarQube analyzes the project's JavaScript/TypeScript code, test coverage, bugs, vulnerabilities, code smells, and maintainability.

## SonarLint

SonarLint can be used in the IDE for immediate feedback while developing.

Install the SonarLint extension in VS Code and open the project.

## Useful Commands

### Frontend

```bash
npm run dev
npm test
npm run build
npm run lint
```

### Backend

```bash
npm run dev
npm test
npm run build
npm run lint
```

## Git Workflow

Feature branches are created from `develop`:

```text
develop
└── feature/<area>/<feature-name>
```

Example:

```text
feature/backend/auth
feature/backend/notes
feature/frontend/auth
feature/frontend/dashboard-ui
```

Pull requests should target the project's `develop` branch.

## License

This project was developed as part of the 10Pearls MERN Cohort project.