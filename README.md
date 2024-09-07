# node-api

Backend service for managing movies and their ratings. It is built using [Fastify](https://fastify.dev/), TypeScript, and PostgreSQL, and follows a modular, [vertical slice architecture](https://vladimirzdrazil.com/til/software-architecture/vertical-slice-architecture/).

Code is definitely not production-ready. I wanted to see how easy it is to set up a [Fastify](https://fastify.dev/) BE project from scratch and experiment with some new tools and techniques.

## Features

- Movie management: CRUD operations for movies.
- Rating system: Rate and fetch ratings.
- [Vertical slice architecture](https://vladimirzdrazil.com/til/software-architecture/vertical-slice-architecture/).
- SQL migrations and seed data.
- Environment-based config.
- Swagger docs.
- Unit and integration tests.

## Getting started

Follow these steps to get the project up and running: 0. Install the prerequisites.

First install the following prerequisites:

- [docker](https://docs.docker.com/get-docker/)
- [yarn](https://yarnpkg.com/getting-started/install)

1. Clone the repository:
   ```bash
   git clone <repository-url> && cd <repository-name>
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Set up the environment variables: Copy `.env.example` to `.env` and modify as needed.
   ```bash
   cp .env.example .env
   ```
4. Start the PostgreSQL database:
   ```bash
   docker-compose up -d
   ```
5. Run the migrations:
   ```bash
    yarn db:migrate
   ```
6. Seed the database with example data:
   ```bash
    yarn db:seed
   ```
7. Start the server:
   ```bash
    yarn dev
   ```

Use `yarn db:codegen -w` to generate TypeScript types and methods for your SQL queries. Follow already existing code to understand how to create new features and queries.

## Docs

Swagger docs are available at `http://localhost:3000/api-docs`.

Most of the endpoints are locked behind a simple authentication scheme. Use the token endpoint to get a token and then click on the lock icon in the top right corner to authenticate.

## Architecture

Code is organized into [vertical slices](https://vladimirzdrazil.com/til/software-architecture/vertical-slice-architecture/). Each slice contains all the layers needed for a feature. For example, the movie slice contains the following layers:

- controller
- service
- repository

Some layers are a bit of an overkill for this project, but they are included for demonstration purposes.

Each layer is testable in isolation. No dependency injection libraries are used, we just pass dependencies as arguments for simplicity.

No ORM is used, just raw SQL queries to keep things simple. We use [PgTyped](https://pgtyped.dev/) to generate TypeScript types and methods for our SQL queries.

Even though I call things repository, service, etc., they are not strictly following the [repository pattern](https://martinfowler.com/eaaCatalog/repository.html) or [service pattern](https://martinfowler.com/eaaCatalog/service.html). They are just layers that help me organize the code. For example, we're mixing rating and movie logic in the movie repository. I think it's worth the [trade-off](https://softwareengineering.stackexchange.com/a/421273).

## Testing

Tests are written using [Jest](https://jestjs.io/).

- Run unit tests:
  ```bash
  yarn test
  ```
- Run tests in watch mode:
  ```bash
  yarn test:watch
  ```

To test database interactions, we use a separate test database that is created and destroyed for each test run through docker-compose.

## Unsolved problems

- [ ] No real security measures are implemented.
- [ ] Authentication and authorization are very basic and insecure. We're using a hardcoded secret for JWT and a simple token-based authentication scheme.
- [ ] Performance and caching are not considered.
- [ ] No logging or monitoring.
- [ ] There is some rudimentary error handling, but I didn't spend much time on it.
- [ ] Probably wrong handling of floating point numbers. We could use something like [decimal.js](https://mikemcl.github.io/decimal.js/).
- [ ] We're using `LIKE` for searching movies, which is not very efficient. We could use a full-text search engine like [Elasticsearch](https://www.elastic.co/elastic-stack) or [Algolia](https://www.algolia.com/).
- [ ] CI and CD are not set up.
- [ ] Create an intersection table for genres and movies.

## Notes

A lot of inspiration for the boilerplate was taken from [this repo](https://github.com/marcoturi/fastify-boilerplate). But it kept evolving and changing as I experimented with different approaches.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
