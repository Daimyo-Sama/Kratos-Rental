const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); //{ default: mongoose }
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");

const User = require("./models/User.js");
const Car = require("./models/Car.js");
const Trip = require("./models/Trip.js");
const Review = require("./models/Review.js");
const Task = require("./models/Task.js");
const { sendResetPasswordEmail } = require("./utilities/authEmail.js");

const {
  paypalClient,
  transferPaymentToOwner,
} = require("./utilities/paypal.js");
const paypal = require("@paypal/checkout-server-sdk");

const { sendConfirmationEmail } = require("./utilities/authEmail.js");
const { generateUserTasks } = require("./utilities/TasksGenerate.js");

require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10); //Secret
const jwtSecret = "fasefraw4r5r3wq45wdfgw34twdfg";

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

mongoose.connect(process.env.MONGO_URL);

//helper function to check json token
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    console.log("Cookies:", req.cookies);
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error("JWT verification error:", err);
        return reject(err);
      }
      console.log("UserData:", userData);
      resolve(userData);
    });
  });
}

app.get("/test", (req, res) => {
  res.json("test ok");
});

//////////////////////
// Create a PayPal order
app.post("/create-paypal-order", async (req, res) => {
  const { amount } = req.body;
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "CAD",
          value: amount.toString(), // Ensure amount is a string
        },
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    res.json({ id: order.result.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ error: error.message });
  }
});

// Capture a PayPal order
app.post("/capture-paypal-order", async (req, res) => {
  const { orderID, tripID } = req.body;
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    console.log("Executing PayPal capture request...");
    const capture = await paypalClient.execute(request);
    console.log("PayPal capture response:", capture);

    // Check if the payment was successful
    if (capture.result.status === "COMPLETED") {
      console.log("Payment completed, updating trip status...");
      const trip = await Trip.findById(tripID).populate({
        path: 'car',
        populate: {
          path: 'owner',
          model: 'User',
        }
      });

      if (!trip) {
        console.log("Trip not found:", tripID);
        return res.status(404).json({ error: "Trip not found" });
      }

      trip.status = "confirmed";
      await trip.save();

      // Transfer payment to the owner
      const ownerPayment = await transferPaymentToOwner(trip);

      console.log("Trip status updated to confirmed:", trip);
      res.json({
        message: "Payment successful and trip confirmed!",
        capture: capture.result,
        ownerPayment
      });
    } else {
      console.log("Payment not completed:", capture.result.status);
      res.status(400).json({ error: "Payment not completed" });
    }
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    res.status(500).json({ error: error.message });
  }
});

// Recuperer le PayPal email du client
app.post("/update-paypal-email", async (req, res) => {
  const { userId, paypalEmail } = req.body;

  try {
    // Update the user's PayPal email
    const user = await User.findByIdAndUpdate(
      userId,
      { paypalEmail },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the task status to completed
    const tasks = await Task.updateMany(
      { user: userId, description: "Provide your Paypal email to receive payments" },
      { $set: { status: "completed" } }
    );

    // Fetch updated tasks
    const updatedTasks = await Task.find({ user: userId });

    res.json({
      message: "PayPal email updated successfully",
      user,
      tasks: updatedTasks,
    });
  } catch (error) {
    console.error("Error updating PayPal email:", error);
    res.status(500).json({ error: "Failed to update PayPal email" });
  }
});

//////////////////////

/////////////////////

app.post("/register", async (req, res) => {
  const { name, email, password, account_level } = req.body; // Include account_level in the request body

  try {
    // Create user
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      confirmed: false,
      account_level,
    });

    // Generate token for email confirmation
    const token = jwt.sign(
      { id: userDoc._id, email: userDoc.email },
      jwtSecret,
      { expiresIn: "1d" }
    );

    // Send confirmation email
    await sendConfirmationEmail(email, token);

    res.json({
      message:
        "Registration successful! Please check your email to confirm your account.",
    });
  } catch (e) {
    console.error("Register error:", e);
    res.status(422).json(e);
  }
});

// Email confirmation route
app.get("/auth/confirm-email", async (req, res) => {
  const { token } = req.query;

  try {
    const { id } = jwt.verify(token, jwtSecret);
    await User.findByIdAndUpdate(id, { confirmed: true });
    res.send("Email confirmed successfully!");
  } catch (e) {
    console.error("Email confirmation error:", e);
    res.status(400).send("Invalid token or token expired");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        if (!userDoc.confirmed) {
          return res
            .status(403)
            .json({ message: "Please confirm your email to log in." });
        }

        // Check and generate tasks if not already present
        const userTasks = await Task.find({ user: userDoc._id });
        if (userTasks.length === 0) {
          // on genere les task si cest vide
          await generateUserTasks(userDoc._id, userDoc.account_level);
        }

        jwt.sign(
          {
            email: userDoc.email,
            id: userDoc._id,
          },
          jwtSecret,
          {},
          (err, token) => {
            if (err) {
              console.error("JWT sign error:", err);
              return res.status(500).json({ message: "Internal server error" });
            }
            console.log("Token:", token);
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        res.status(422).json({ message: "Invalid password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//delete cookie d<acces
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});
////////////

//stocke les photos localement
const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

// pour pouvoir upload les photos
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

////////////////

///////////////

//obtenir les infos pour userContext et le profil
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error("JWT verification error:", err);
        res.status(401).json({ error: "Invalid token" });
        return;
      }
      try {
        const user = await User.findById(userData.id);
        const { name, email, _id, bio, profilePicture } = user;
        res.json({ name, email, _id, bio, profilePicture });
      } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } else {
    res.status(401).json({ error: "Token missing" });
  }
});

app.post("/become-owner", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const userId = userData.id;

    // Update user's account level to owner
    const user = await User.findByIdAndUpdate(
      userId,
      { account_level: "owner" },
      { new: true }
    );
    // Generate tasks
    await generateUserTasks(userId, user.account_level);

    res.json({
      message: "User is now an owner and tasks have been generated.",
      user,
    });
  } catch (error) {
    console.error("Error generating tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/profile/bio", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userData.id,
      { bio },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update bio" });
  }
});

app.put(
  "/profile/picture",
  photosMiddleware.single("profilePicture"),
  async (req, res) => {
    try {
      const userData = await getUserDataFromReq(req);
      const updateData = {};

      if (req.file) {
        updateData.profilePicture = "/uploads/" + req.file.filename;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userData.id,
        updateData,
        { new: true }
      );
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: "Failed to update profile picture" });
    }
  }
);

app.get("/tasks", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const tasks = await Task.find({ user: userData.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task." });
  }
});

///////////////

//////////////

app.get("/user-cars", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { id } = userData;
    const cars = await Car.find({ owner: id });
    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

// creer une voiture
app.post("/cars", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error("JWT verification error:", err);
      throw err;
    }
    const carDoc = await Car.create({
      owner: userData.id,
      price,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    });
    res.json(carDoc);
  });
});

app.get("/cars/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate({
      path: "owner",
      select: "profilePicture bio reviews",
      populate: {
        path: "reviews",
        model: "Review",
        populate: {
          path: "reviewer",
          select: "name profilePicture"
        }
      }
    });

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




//pour modifier les annonces de voitures
app.put("/cars", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error("JWT verification error:", err);
      throw err;
    }
    const carDoc = await Car.findById(id);
    if (userData.id === carDoc.owner.toString()) {
      carDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await carDoc.save();
      res.json("ok");
    }
  });
});

///////

///////

// Page Accueil
app.get("/cars", async (req, res) => {
  try {
    const cars = await Car.find().populate("owner");
    const carsWithValidOwners = cars.filter((car) => car.owner !== null);

    res.json(carsWithValidOwners); // make sure that deleted users cars dont appear
  } catch (e) {
    console.error("Error fetching cars:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// pour booker des voitures
app.post("/trips", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { car, checkIn, checkOut, numberOfGuests, name, phone, price } =
      req.body;

    // Convert checkIn and checkOut to Date objects
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    console.log("Request data:", {
      car,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      name,
      phone,
      price,
    });

    // Check for overlapping trips
    const overlappingTrips = await Trip.find({
      car,
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } },
        { checkIn: { $gte: checkInDate, $lt: checkOutDate } },
        { checkOut: { $gt: checkInDate, $lte: checkOutDate } },
      ],
    });

    if (overlappingTrips.length > 0) {
      console.log("Overlapping trips:", overlappingTrips);
      return res
        .status(400)
        .json({ error: "This car is already booked for the selected dates." });
    }

    // Create the trip
    const trip = await Trip.create({
      car,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
      user: userData.id,
      status: "upcoming", // statut du trip
    });

    console.log("Trip created:", trip);

    // Update car status to 'booked'
    const updatedCar = await Car.findByIdAndUpdate(
      car,
      { status: "booked" },
      { new: true }
    );

    if (!updatedCar) {
      console.error("Failed to update car status");
      return res.status(500).json({ error: "Failed to update car status" });
    }

    console.log("Car status updated to booked:", updatedCar);

    res.json(trip);
  } catch (err) {
    console.error("Error creating trip:", err);
    res.status(500).json({ error: "Failed to create trip." });
  }
});

app.get("/trips", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Trip.find({ user: userData.id }).populate("car"));
});

// pour afficher le statut de la voiture dans my cars
app.get("/user-trips", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const trips = await Trip.find({ user: userData.id }).populate("car");
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user trips" });
  }
});

// pour la page TripDetails??
app.get("/trips/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate({
        path: "car",
        populate: {
          path: "owner",
          model: "User",
        },
      })
      .populate("user");

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    console.log("Trip Data:", trip);
    res.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get trips for a specific car
app.get("/trips/car/:carId", async (req, res) => {
  try {
    const { carId } = req.params;
    const trips = await Trip.find({ car: carId })
      .populate("car")
      .populate("user");

    if (!trips || trips.length === 0) {
      return res.status(404).json({ error: "No trips found for this car" });
    }
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to accept reservation
app.put("/trips/:id/accept", async (req, res) => {
  const { id } = req.params;
  try {
    const userData = await getUserDataFromReq(req);
    const userId = userData.id; // Get the authenticated user's ID

    const trip = await Trip.findById(id).populate("car");
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const car = await Car.findById(trip.car._id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    if (car.owner.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    trip.status = "unpaid";
    await trip.save();

    // await Car.findByIdAndUpdate(car._id, { status: 'booked' }); // Update car status to 'booked'

    res.json(trip);
  } catch (error) {
    console.error("Error accepting reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/trips/:id/archive", async (req, res) => {
  const { id } = req.params;
  try {
    const userData = await getUserDataFromReq(req);
    const userId = userData.id; // Get the authenticated user's ID

    const trip = await Trip.findById(id);  //.populate("car")
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // const car = await Car.findById(trip.car._id);
    // if (!car) {
    //   return res.status(404).json({ error: "Car not found" });
    // }

    if (
      trip.user.toString() !== userId.toString() // &&
      // car.owner.toString() !== userId.toString()
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    trip.userStatus = "archived";
    await trip.save();

    // await Car.findByIdAndUpdate(car._id, { status: "available" }); // Update car status to 'available'

    res.json(trip);
  } catch (error) {
    console.error("Error archiving trip:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/trips/:id/cancel", async (req, res) => {
  const { id } = req.params;
  try {
    const userData = await getUserDataFromReq(req);
    const userId = userData.id; // Get the authenticated user's ID

    const trip = await Trip.findById(id).populate("car");
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const car = await Car.findById(trip.car._id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    if (
      trip.user.toString() !== userId.toString() &&
      car.owner.toString() !== userId.toString()
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    trip.status = "cancelled";
    await trip.save();

    await Car.findByIdAndUpdate(car._id, { status: "available" }); // Update car status to 'available'

    res.json(trip);
  } catch (error) {
    console.error("Error canceling trip:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to create a review
app.post("/reviews", async (req, res) => {
  try {
    const { reviewedUserId, tripId, carId, rating, comment } = req.body;
    const userData = await getUserDataFromReq(req);
    const reviewerId = userData.id; // Securely get the reviewer ID from the session

    console.log("Creating review:", {
      reviewedUserId,
      tripId,
      carId,
      rating,
      comment,
      reviewerId,
    });

    const newReview = new Review({
      reviewer: reviewerId,
      reviewedUser: reviewedUserId,
      trip: tripId,
      car: carId,
      rating,
      comment,
    });

    await newReview.save();

    console.log("New review saved:", newReview);

    await User.findByIdAndUpdate(reviewedUserId, {
      $push: { reviews: newReview._id },
    });
    console.log(`User ${reviewedUserId} updated with new review`);

    if (carId) {
      await Car.findByIdAndUpdate(carId, { $push: { reviews: newReview._id } });
      console.log(`Car ${carId} updated with new review`);
    }

    if (tripId) {
      await Trip.findByIdAndUpdate(tripId, {
        $push: { reviews: newReview._id },
      });
      console.log(`Trip ${tripId} updated with new review`);
    }

    res.status(201).json(newReview);
  } catch (err) {
    console.error("Failed to create review:", err);
    res.status(500).json({ error: "Failed to create review" });
  }
});


// Route to get reviews for a specific user
app.get("/users/:userId/reviews", async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ reviewedUser: userId })
      .populate("reviewer")
      .populate("car")
      .populate("trip");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

app.get('/deals', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const userCars = await Car.find({ owner: userData.id });
    const userCarsId = userCars.map(car => car._id.toString());
    const allDeals = [];

    for (let i = 0; i < userCarsId.length; i++) {
      const deals = await Trip.find({ car: userCarsId[i] })
        .populate({
          path: 'car',
          populate: {
            path: 'owner',
            model: 'User',
          }
        })
        .populate({
          path: 'user',
          model: 'User',
          select: 'name email profilePicture reviews',
          populate: {
            path: 'reviews',
            populate: {
              path: 'reviewer',
              model: 'User',
              select: 'name'
            }
          }
        });

      allDeals.push(...deals);
    }

    res.json(allDeals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Route to handle password reset request
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });
    await sendResetPasswordEmail(email, token);

    res.json({ message: "Password reset link sent to your email address." });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const hashedPassword = bcrypt.hashSync(newPassword, bcryptSalt);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error in reset-password:", error);
    res.status(400).json({ message: "Invalid or expired token." });
  }
});


app.listen(4000, () => {
  console.log("Server running on port 4000");
});
