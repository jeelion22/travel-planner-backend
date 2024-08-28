# Travel-Planner-India (BackEnd)

This repository contains the backend APIs for the Travel Planner India app.

## Table of Contents

- [Introduction](#introduction)
- [API Documentation Link](#api-documentation-link)
- [Technologies Used](#technologies-used)
- [Server Deployment](#server-deployment)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

It includes endpoints for managing travel itineraries, accommodations, bookings, and user data. And also has endpoints for admin user others than app users The backend is built with Node.js and Express, and integrates with MongoDB for data storage.

## API Documentation Link

The API documentation is prepared using Postman.

<!-- [Click here](https://documenter.getpostman.com/view/21877600/2sA3e1CW6i) for API documentation. -->

## Server Deployment

The server is hosted on [Render](https://render.com/) and [click](https://travel-planner-backend-z03r.onrender.com/api) here for end points.

## Technologies Used

- **bcrypt**: Library for hashing passwords.
- **cookie-parser**: Middleware for parsing cookies in Express.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.
- **dotenv**: Module for loading environment variables from a `.env` file into `process.env`.
- **express**: Web framework for Node.js.
- **express-validator**: Middleware for input validation in Express.
- **jsonwebtoken**: Implementation of JSON Web Tokens (JWT) for authentication.
- **mongoose**: MongoDB object modeling tool for Node.js.
- **morgan**: HTTP request logger middleware for Node.js.
- **nodemailer**: Module for sending emails from Node.js.
- **nodemon**: Utility for auto-restarting the server during development.
- **validator**: Library for string validation and sanitization.

## Installation

1. **Clone the repository:**

   ```bash
   https://github.com/jeelion22/travel-planner-backend.git
   cd travel-planner-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a .env file in the root directory and add the required environment variables.

4. **Run the application:**
   ```bash
   npm run dev
   ```

## Usage

Once the server is running, you can start making requests to the defined API endpoints. Refer to the API documentation for detailed information on each endpoint and its usage.

## Contributing

Contributions are crucial to enhancing the security, reliability, and functionality of the travel-planner-backend. Your input can help integrate features, fixing bugs, and user experience as a stand alone app.

### How You Can Contribute

1. **Code Contributions**: Help develop new features, fix bugs, and optimize performance.
2. **Documentation**: Improve documentation to make it more accessible and comprehensive.
3. **Testing**: Contribute by testing the application and reporting issues or bugs.
4. **Feedback**: Provide feedback on usability, functionality, and potential improvements.

### Guidelines

- **Respect Privacy**: Ensure all contributions prioritize the privacy and safety of individuals involved.
- **Collaboration**: Work together with the community and maintain open communication.
- **Quality Assurance**: Follow best practices for code quality, security, and performance.

Your contributions are valued and essential in making the app a secure and reliable platform for travel planning

## License

MIT License

---
