# NestJS Backend Boilerplate

This is a NestJS backend project boilerplate designed to accelerate the development of robust and scalable APIs. This project includes JWT authentication with refresh token, Stripe integration for payments, email sending with Nodemailer, real-time notifications with Socket.io, DTO validation with Class Validator, and environment variables management. Additionally, it has role-based route access control to protect your routes.

## Features

- **JWT Authentication with Refresh Token**: Secure your routes and keep users authenticated.
- **Stripe Payments**: Integrated payment platform.
- **Email Sending with Nodemailer**: Easily send emails to your users.
- **Real-time Notifications with Socket.io**: Implement real-time notifications easily.
- **DTO Validation with Class Validator**: Ensure the integrity of data received in your APIs.
- **Environment Variables Management**: Easily configure different environments (development, production, etc.).
- **Role-Based Access Control**: Protect your routes based on user permissions.

## Technologies Used

- Authentication with JWT and Refresh Token
- [`Stripe`](https://docs.stripe.com/api) Payment Gateway
- Email Sending with [`Nodmeailer`](https://nodemailer.com/)
- Real-time Notifications with [`Socket.io`](https://socket.io/)
- DTO and Environment Variables Validation with [`class-validator`](https://github.com/typestack/class-validator) and [`class-transformer`](https://github.com/typestack/class-transformer)
- Role-Based Access Control
- Integrations Tests with [`Jest`](https://jestjs.io/)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Configure environment variables:
  
    Create a .env file in the root of the project and add your environment variables. Example of .env:
  
    ```sh
    # Database configuration
    DATABASE_HOST=
    DATABASE_PORT=
    DATABASE_USERNAME=
    DATABASE_PASSWORD=
    DATABASE_NAME=

    DATABASE_URL=

    # Stripe configuration (payment gateway)
    STRIPE_API_KEY=

    # JWT secret
    JWT_SECRET=

    # Email configuration
    EMAIL_HOST=
    EMAIL_PORT=
    EMAIL_USERNAME=2
    EMAIL_PASSWORD=
    EMAIL_FROM=
    ```

4. Run database migrations (if necessary):
    ```sh
    npm run prisma:migrate:dev
    ```

5. Start the server:
      ```sh
      npm run start:dev
      ```