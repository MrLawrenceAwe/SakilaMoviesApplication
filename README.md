# Sakila Movies Application

[![CI](https://github.com/MrLawrenceAwe/SakilaMoviesApplication/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/MrLawrenceAwe/SakilaMoviesApplication/actions/workflows/build.yml)

A full-stack application for searching, browsing, adding, and updating records from the Sakila movie database.

## Features

- Spring Boot REST API for film lookup by title and category.
- Endpoints for film categories and languages.
- Create and update flows for film records.
- React frontend for searching and editing film data.
- Backend unit tests and React tests for initial data loading and error handling.
- GitHub Actions CI for Maven verification; optional SonarCloud analysis is available manually.

## Tech Stack

- Java 17
- Spring Boot
- JDBC and MySQL
- React
- Material UI
- JUnit

## Database setup

Requires Java 17, Maven, Node.js 22+ and MySQL 8. Download the official [MySQL Sakila sample database](https://dev.mysql.com/doc/sakila/en/sakila-installation.html) and import `sakila-schema.sql`, then `sakila-data.sql`:

```sh
mysql -u root -p < sakila-schema.sql
mysql -u root -p < sakila-data.sql
```

Create a dedicated local application user in MySQL, replacing the example password:

```sql
CREATE USER 'moviesapp'@'localhost' IDENTIFIED BY 'replace-with-a-local-password';
GRANT SELECT, INSERT, UPDATE ON sakila.* TO 'moviesapp'@'localhost';
```

The frontend runs at `http://localhost:3000`; its API calls target `http://localhost:8080/api`. Tests use mocks and do not require a live database.

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
npm ci
npm start
```

## Tests

```bash
mvn test
cd movies-application-frontend && npm test -- --watchAll=false
npm run build
```

## Continuous integration

Every push and pull request runs `mvn -B verify` with Java 17. SonarCloud is an optional, manually dispatched workflow that requires a configured `SONAR_TOKEN`; external analysis is separate from build/test verification.

CI also runs the React tests and production frontend build.
