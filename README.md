## School Management Api

An api for managing a school.

# Dependecies

- [Docker](https://www.docker.com/)
- [Node](https://nodejs.org/en)
- [Docker]()
- [Docker-Compose]()

# Setup Development

- Install and setup redis and mongodb
- Then run the following commands

  ```
  npm install
  ```

- Create `.env` and replace the variables below with your values i.e

  ```
    LONG_TOKEN_SECRET='long_token_secret'
    SHORT_TOKEN_SECRET='short_token_secret'
    NACL_SECRET='nacl_secret'
    SERVICE_NAME='schapi'
    MONGO_URI='mongodb://localhost:27017/your-database'
    USER_PORT=4000
    NODE_ENV=development
  ```

  then run `source .env`

- Run the migrations

  ```
  npm run dev
  ```

- Run API using docker-compose

  ```
  docker-compose up --build 
  ```

Visit the following endpoints:
	• API Docs (Swagger UI): http://localhost:4000/api-docs
	• Main API Route: http://localhost:4000/api


## Testing the endpoint

- Use the seed data provided by `seed.manager` to test the API endpoint
- Create a token by login in a test user
- Use the created token to hit the other endpoints according to the documentaiton

## Deployment

This App is hosted at  http://46.101.220.126:4000/api-docs/
```

## Authentication Flow

- create a user via the create user endpoint. A user can have a role i.e SchoolAdmin, Student, SuperAdmin
- For Authorization add the `token` to the authorization header.
- The school endpoints protected and can only be accessed by SuperAdmin
- classroom and students endpoints are accessed by SchoolAdmin and SuperAdmin

### TODO
To further imporve the codebase we should( I didn't have enough time):
- Write integration and e2e tests
- Make sure the github action to deploy the service works
- Enroll and transfer students
- Document student endpoint

