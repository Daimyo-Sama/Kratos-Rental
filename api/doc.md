## Introduction

Welcome to the API documentation for our car rental application. This API follows a classic MVC (Model-View-Controller) architecture, designed to be straightforward and easy to use. Please note that this application is not modular, meaning the index file contains both the routes and controller logic.

### Getting Started

To use this API, you need to set up the following:

1. **Install Dependencies**: Make sure you have Node.js and MongoDB installed on your system. Clone the repository and run the following command to install the necessary dependencies:

   ```sh
   npm install
   ```

2. **Set Up Environment Variables**: Create a `.env` file at the root of your project and add the necessary environment variables:

   ```env
   PORT=4000
   MONGO_URL=
   EMAIL_USER=
   EMAIL_PASS=
   JWT_SECRET=
   PAYPAL_CLIENT_ID=
   PAYPAL_CLIENT_SECRET=
   NODE_ENV=
   ```

3. **Checkout the function** : Consult `authEmail.js` and `paypal.js` to adapt them to your credentials.

4. **Start the Server**: Run the following command to start the server:

   ```sh
   npm start index
   nodemon index
   ```

# MongoDB Database Schema Documentation

## Collections

1. [Cars](#cars-collection)
2. [Reviews](#reviews-collection)
3. [Users](#users-collection)
4. [Tasks](#tasks-collection)
5. [Trips](#trips-collection)

## Cars Collection

- **\_id** : Unique identifier for each car (ObjectId).
- **owner** : Reference to the user who owns the car (ObjectId, ref: 'User').
- **title** : Title of the car listing (String).
- **address** : Address where the car is located (String).
- **photos** : List of URLs of the car's photos (Array of Strings).
- **description** : Description of the car (String).
- **perks** : List of perks or additional features of the car (Array of Strings).
- **extraInfo** : Additional information (String).
- **checkIn** : Check-in time (Number).
- **checkOut** : Check-out time (Number).
- **maxGuests** : Maximum number of guests (Number).
- **price** : Rental price of the car (Number).
- **status** : Status of the car, can be "available" or "booked" (String, enum, default: 'available').

## Reviews Collection

- **\_id** : Unique identifier for each review (ObjectId).
- **reviewer** : Reference to the user who leaves the review (ObjectId, ref: 'User', required: true).
- **reviewedUser** : Reference to the user who receives the review (ObjectId, ref: 'User', required: true).
- **trip** : Reference to the trip associated with the review (ObjectId, ref: 'Trip').
- **car** : Reference to the car associated with the review (ObjectId, ref: 'Car').
- **rating** : Rating given, from 1 to 5 (Number, min: 1, max: 5, required: true).
- **comment** : Comment left by the user (String, required: true).
- **createdAt** : Date when the review was created (Date, default: Date.now).

## Users Collection

- **\_id** : Unique identifier for each user (ObjectId).
- **name** : Name of the user (String).
- **email** : Email address of the user (String, unique, required: true).
- **password** : Password of the user (String).
- **profilePicture** : URL of the user's profile picture (String).
- **bio** : Biography of the user (String).
- **confirmed** : Confirmation status of the user (Boolean, default: false).
- **reviews** : List of reviews left for the user (Array of ObjectIds, ref: 'Review').
- **account_level** : Account level of the user, can be "client" or "owner" (String, enum, default: 'client').
- **tasks** : List of tasks assigned to the user (Array of ObjectIds, ref: 'Task').
- **paypalEmail** : PayPal email address of the user (String).

## Tasks Collection

- **\_id** : Unique identifier for each task (ObjectId).
- **description** : Description of the task (String, required: true).
- **status** : Status of the task, can be "pending" or "completed" (String, enum, default: 'pending').
- **user** : Reference to the user assigned to the task (ObjectId, ref: 'User', required: true).

## Trips Collection

- **\_id** : Unique identifier for each trip (ObjectId).
- **car** : Reference to the car associated with the trip (ObjectId, ref: 'Car', required: true).
- **user** : Reference to the user who booked the trip (ObjectId, ref: 'User', required: true).
- **checkIn** : Check-in date and time (Date, required: true).
- **checkOut** : Check-out date and time (Date, required: true).
- **name** : Name of the person who booked (String, required: true).
- **phone** : Phone number of the person who booked (String, required: true).
- **price** : Price of the trip (Number).
- **status** : Status of the trip, can be "upcoming", "unpaid", "confirmed", "ongoing", "completed", or "cancelled" (String, enum, default: 'upcoming').
- **userStatus** : Status of the trip for the user, can be "inprogress", "archived", or "deleted" (String, enum, default: 'inprogress').
- **ownerStatus** : Status of the trip for the owner, can be "inprogress", "archived", or "deleted" (String, enum, default: 'inprogress').

## Relations Between Collections

- The **Cars** collection contains references to the **Users** collection to associate each car with its owner.
- The **Reviews** collection contains references to the **Users**, **Trips**, and **Cars** collections to associate each review with a user, a trip, and a car.
- The **Users** collection contains references to the **Reviews** collection to associate each user with the reviews they have received, and to the **Tasks** collection for the tasks assigned to them.
- The **Tasks** collection contains references to the **Users** collection to associate each task with a user.
- The **Trips** collection contains references to the **Cars** and **Users** collections to associate each trip with a car and a user.

# API Routes

## Authentication and User Management

### Register a New User

- **URL**: `/register`
- **Method**: `POST`
- **Description**: Registers a new user with the provided name, email, password, and account level. Sends a confirmation email to the user.

### Confirm Email

- **URL**: `/auth/confirm-email`
- **Method**: `GET`
- **Description**: Confirms the user's email address using a token sent to their email.

### Login

- **URL**: `/login`
- **Method**: `POST`
- **Description**: Authenticates a user with email and password. Issues a JWT token and sets a cookie.

### Logout

- **URL**: `/logout`
- **Method**: `POST`
- **Description**: Logs out the user by clearing the JWT token cookie.

### Check PayPal Email

- **URL**: `/check-paypal-email/:userId`
- **Method**: `GET`
- **Description**: Checks if the PayPal email is provided for the given user.

### Update PayPal Email

- **URL**: `/update-paypal-email`
- **Method**: `POST`
- **Description**: Updates the PayPal email for the given user and marks the related task as completed.

### Get Profile

- **URL**: `/profile`
- **Method**: `GET`
- **Description**: Retrieves the profile of the currently authenticated user.

### Become an Owner

- **URL**: `/become-owner`
- **Method**: `POST`
- **Description**: Upgrades the user to an owner and generates owner-specific tasks.

### Update Bio

- **URL**: `/profile/bio`
- **Method**: `PUT`
- **Description**: Updates the bio of the authenticated user.

### Update Profile Picture

- **URL**: `/profile/picture`
- **Method**: `PUT`
- **Description**: Updates the profile picture of the authenticated user.

### Get Tasks

- **URL**: `/tasks`
- **Method**: `GET`
- **Description**: Retrieves tasks for the authenticated user.

### Update Task

- **URL**: `/tasks/:id`
- **Method**: `PUT`
- **Description**: Updates the status of a task.

## Car Management

### Search Cars by Address

- **URL**: `/api/cars/search`
- **Method**: `GET`
- **Description**: Searches for cars by address.

### Get User Cars

- **URL**: `/user-cars`
- **Method**: `GET`
- **Description**: Retrieves cars owned by the authenticated user.

### Add a New Car

- **URL**: `/cars`
- **Method**: `POST`
- **Description**: Adds a new car to the authenticated user's account.

### Get Car Details

- **URL**: `/cars/:id`
- **Method**: `GET`
- **Description**: Retrieves details of a specific car by its ID.

### Update Car Details

- **URL**: `/cars`
- **Method**: `PUT`
- **Description**: Updates the details of a car owned by the authenticated user.

### Delete Car

- **URL**: `/cars/:id`
- **Method**: `DELETE`
- **Description**: Deletes a specific car by its ID.

### Get All Cars

- **URL**: `/cars`
- **Method**: `GET`
- **Description**: Retrieves all cars with valid owners.

### Search Cars

- **URL**: `/api/cars/search`
- **Method**: `GET`
- **Description**: Searches for cars based on the provided address query parameter.

## Trip Management

### Create a Trip

- **URL**: `/trips`
- **Method**: `POST`
- **Description**: Creates a new trip with the provided details. Checks for overlapping trips and updates the car's status to "booked".

### Get User Trips

- **URL**: `/trips`
- **Method**: `GET`
- **Description**: Retrieves trips for the authenticated user.

### Get Trip Details

- **URL**: `/trips/:id`
- **Method**: `GET`
- **Description**: Retrieves details of a specific trip by its ID.

### Get Trips by Car ID

- **URL**: `/trips/car/:carId`
- **Method**: `GET`
- **Description**: Retrieves trips for a specific car by its ID.

### Archive Trip

- **URL**: `/trips/:id/archive`
- **Method**: `PUT`
- **Description**: Archives a specific trip by its ID.

### Cancel Trip

- **URL**: `/trips/:id/cancel`
- **Method**: `PUT`
- **Description**: Cancels a specific trip by its ID and updates the car's status to "available".

## Deal Management

### Get Deals

- **URL**: `/deals`
- **Method**: `GET`
- **Description**: Retrieves deals for the authenticated user.

### Accept Deal

- **URL**: `/deals/:id/accept`
- **Method**: `PUT`
- **Description**: Accepts a specific deal by its ID and updates its status to "unpaid".

### Check-in Deal

- **URL**: `/deals/:id/checkin`
- **Method**: `PUT`
- **Description**: Checks in a specific deal by its ID and updates its status to "ongoing".

### Check-out Deal

- **URL**: `/deals/:id/checkout`
- **Method**: `PUT`
- **Description**: Checks out a specific deal by its ID and updates its status to "completed".

### Cancel Deal

- **URL**: `/deals/:id/cancel`
- **Method**: `PUT`
- **Description**: Cancels a specific deal by its ID and updates the car's status to "available".

### Archive Deal

- **URL**: `/deals/:id/archive`
- **Method**: `PUT`
- **Description**: Archives a specific deal by its ID.

## Review Management

### Create Review

- **URL**: `/reviews`
- **Method**: `POST`
- **Description**: Creates a new review for a specific user, trip, and car.

### Get User Reviews

- **URL**: `/users/:userId/reviews`
- **Method**: `GET`
- **Description**: Retrieves reviews for a specific user by their ID.

## Payment Management

### Create a PayPal Order

- **URL**: `/create-paypal-order`
- **Method**: `POST`
- **Description**: Creates a PayPal order for the given amount.

### Capture a PayPal Order

- **URL**: `/capture-paypal-order`
- **Method**: `POST`
- **Description**: Captures a PayPal order and updates the trip status to confirmed.

## Image Management

### Upload Photos

- **URL**: `/upload`
- **Method**: `POST`
- **Description**: Uploads multiple photos to the server.

### Upload Photo by Link

- **URL**: `/upload-by-link`
- **Method**: `POST`
- **Description**: Uploads a photo to the server using a link.

## Password Management

### Forgot Password

- **URL**: `/forgot-password`
- **Method**: `POST`
- **Description**: Sends a password reset link to the user's email address.

### Reset Password

- **URL**: `/reset-password`
- **Method**: `POST`
- **Description**: Resets the user's password using a token sent to their email.
