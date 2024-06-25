Kratos is a simplified MVC application offering a free market car rental service to its 2 category of users: the clients and the owners. The concept is that an owner is a client but a client needs to meet a condition to become an owner. The API runs on NodeJs and Express and uses Mongo DB. The frontend runs on Vite and ReactJs 

here are the commands to install and run

client directory - npm install ----> npm run dev || yarn run dev
api directory - npm install ----> nodemon index

NOTES - The Paypal transaction is simulated through the Sandbox Api

IMPORTANT - Dont change client local port since cross origin is specified to localhost:5173 in index file.



    -Client Dependencies-

    "@paypal/checkout-server-sdk": "^1.0.3",
    "@stripe/react-stripe-js": "^2.7.1",
    "@stripe/stripe-js": "^3.5.0",
    "autoprefixer": "^10.4.19",
    "axios": "^1.7.2",
    "date-fns": "^3.6.0",
    "postcss": "^8.4.38",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.23.1",
    "tailwindcss": "^3.4.3"

    -API Dependencies-

    "@paypal/checkout-server-sdk": "^1.0.3",
    "axios": "^1.7.2",
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "image-downloader": "^4.3.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.4.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.13",
    "prop-types": "^15.8.1"
  