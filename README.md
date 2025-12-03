# Node.js API with Express with Socket IO, MongoDB, and TypeScript

This is a RESTful API built with Node.js, Express, MongoDB, and TypeScript. It provides user authentication and task management functionalities. It also has SOCKET IO installed for seamless updating of data in the frontend.

## Getting Started with Docker

To run this application, you will need to have Docker and Docker Compose installed on your machine.

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```

2.  **Create an environment file:**

    Create a `.env` file in the root of the project and add the following environment variables:

    ```bash
    MONGODB_URI=your_mongodb_connection_string
    PORT=3000
    SUPERSECRET=your_super_secret_key
    PERPAGE=2
    SOCKET_ORIGIN=http://localhost:5173
    ```

    Replace the placeholder values with your actual configuration.

3.  **Run the application:**

    ```bash
    docker-compose up -d --build
    ```

    This command will build the Docker image and start the application in detached mode. The API will be accessible at `http://localhost:3000`.

## Environment Variables

The following environment variables are required to run the application:

*   `MONGODB_URI`: Your MongoDB connection string.
*   `PORT`: The port on which the application will run.
*   `SUPERSECRET`: A secret key for signing JWT tokens.
*   `PERPAGE`: The number of items to return per page for paginated endpoints.
*   `SOCKET_ORIGIN`: The URL of the frontend application for Socket.IO.

An `example_env` file is provided in the repository. You can copy it to `.env` and fill in the values.

## API Endpoints

The following is a list of the available API endpoints:

### User

| Method | Endpoint | Description                |
| ------ | -------- | -------------------------- |
| POST   | `/user/signup`  | Register a new user.       |
| POST   | `/user/login`   | Authenticate a user.       |

### Task

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| GET    | `/todo/tasks`        | Get all tasks for the user.  |
| POST   | `/todo/task`         | Create a new task.           |
| GET    | `/todo/task/:taskId` | Get a specific task by ID.   |
| PUT    | `/todo/task/:taskId` | Update a specific task by ID.|
| DELETE | `/todo/task/:taskId` | Delete a specific task by ID.|

## Seeding the Database

To populate the database with initial data, you can use the seed script.

1.  **Ensure your `.env` file is correctly set up.** Make sure the `MONGODB_URI` variable in your `.env` file points to your MongoDB instance.

2.  **Compile the TypeScript code:**

    ```bash
    npm run compile
    ```

3.  **Run the seed script:**

    ```bash
    npm run seed
    ```

    After seeding, you can log in with the following credentials:
    *   **Email:** `userone@email.com`
    *   **Password:** `password`
