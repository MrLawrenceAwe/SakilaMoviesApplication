# Sakila Movies Application

A full-stack application for searching, browsing, adding, and updating records from the Sakila movie database.

## Features

- Spring Boot REST API for film lookup by title and category.
- Endpoints for film categories and languages.
- Create and update flows for film records.
- React frontend for searching and editing film data.
- Backend unit tests and frontend test scaffold.
- GitHub Actions workflow for Maven verification and SonarCloud analysis.

## Tech Stack

- Java 17
- Spring Boot
- JDBC and MySQL
- React
- Material UI
- JUnit

## Running Locally

The backend expects a Sakila-compatible MySQL database. Configure connection details with environment variables:

```bash
export RDS_HOSTNAME="localhost"
export RDS_PORT="3306"
export RDS_DB_NAME="sakila"
export RDS_USERNAME="moviesapp"
export SAKILA_DB_PASSWORD="your-password"
mvn spring-boot:run
```

Start the frontend from its folder:

```bash
cd movies-application-frontend
npm install
npm start
```

## Tests

```bash
mvn test
cd movies-application-frontend && npm test
```
