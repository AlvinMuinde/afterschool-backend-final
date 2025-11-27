# Afterschool App – Backend

This is the backend API for the Afterschool Lessons Booking application. It handles lesson retrieval, cart booking, and updating available spaces using a MongoDB database.

## Live Deployment

- API Endpoint: https://afterschool-backend-final.onrender.com

## Features

- GET /lessons – Fetch all lessons
- POST /order – Process booking from cart, update lesson spaces

## Technologies Used

- Node.js
- Express.js
- MongoDB (via official native driver)
- Render (Backend Hosting)
- MongoDB Atlas (Cloud Database)

## Project Structure

backend/
├── server.js
├── package.json
├── .env
├── lessons_export.json
├── README.md


## Setup Notes

- MongoDB used without Mongoose
- Lesson data is stored in MongoDB and synced with `lessons_export.json`
- `.env` file should include:
MONGODB_URI=mongodb+srv://alvinmuinde:Flacko19@clustercw1.dpdevvv.mongodb.net/afterschool
PORT=3000


## API Usage

- `GET /lessons` — returns all lessons from the database
- `POST /order` — processes booking if enough spaces are available

## Assignment Compliance

- No Mongoose used
- Complies with instructions for not using additional frameworks
- Built from scratch using core Node.js and Express.js
