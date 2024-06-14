const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');  //{ default: mongoose }
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

const User = require('./models/User.js');
const Car = require('./models/Car.js');
const Trip = require('./models/Trip.js');
const Review = require('./models/Review.js');

const { sendConfirmationEmail } = require('./utilities/authEmail.js');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10)  //Secret
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173' //127.0.0.1 ->localhost
}));

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        console.log('Cookies:', req.cookies);
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) {
                console.error('JWT verification error:', err);
                return reject(err);
            }
            console.log('UserData:', userData);
            resolve(userData);
        });
    });
}

app.get('/test', (req,res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Create user
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
            confirmed: false // email
        });

        // Generate token for email confirmation
        const token = jwt.sign({ id: userDoc._id, email: userDoc.email }, jwtSecret, { expiresIn: '1d' });

        // Send confirmation email
        await sendConfirmationEmail(email, token);

        res.json({ message: 'Registration successful! Please check your email to confirm your account.' });
    } catch (e) {
        console.error('Register error:', e);
        res.status(422).json(e);
    }
});

// Email confirmation route
app.get('/auth/confirm-email', async (req, res) => {
    const { token } = req.query;

    try {
        const { id } = jwt.verify(token, jwtSecret);
        await User.findByIdAndUpdate(id, { confirmed: true });
        res.send('Email confirmed successfully!');
    } catch (e) {
        console.error('Email confirmation error:', e);
        res.status(400).send('Invalid token or token expired');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            if (!userDoc.confirmed) {
                return res.status(403).json({ message: 'Please confirm your email to log in.' });
            }
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id
            }, jwtSecret, {}, (err, token) => {
                if (err) {
                    console.error('JWT sign error:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                console.log('Token:', token);
                res.cookie('token', token).json(userDoc);
            });
        } else {
            res.status(422).json({ message: 'Invalid password' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});
//delete cookie d<acces
app.post('/logout', (req,res) => {
    res.cookie('token', '').json(true);
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) {
                console.error('JWT verification error:', err);
                throw err;
            }
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null);
    }
});



app.post('/upload-by-link', async (req,res) => {
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' +newName,
    });
    res.json(newName);
});

const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), (req,res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const {path,originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads\\',''));
    }
    res.json(uploadedFiles);
});

app.post('/cars', (req,res) => {
    const {token} = req.cookies;
    const {
        title, address,addedPhotos,description,price,
        perks,extraInfo,checkIn,checkOut,maxGuests,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            console.error('JWT verification error:', err);
            throw err;
        }
        const carDoc = await Car.create({
            owner:userData.id,price,
            title,address,photos:addedPhotos,description,
            perks,extraInfo,checkIn,checkOut,maxGuests,
        });
        res.json(carDoc);
    });
});

app.get('/user-cars', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            console.error('JWT verification error:', err);
            throw err;
        }
        const {id} = userData;
        res.json( await Car.find({owner:id}) );
    });
});

app.get('/cars/:id', async (req,res) => {
    const {id} = req.params;
    res.json(await Car.findById(id));
});

app.put('/cars', async (req,res) => {
    const {token} = req.cookies;
    const {
        id, title, address,addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            console.error('JWT verification error:', err);
            throw err;
        }
        const carDoc = await Car.findById(id);
        if(userData.id === carDoc.owner.toString()) {
            carDoc.set({
                title,address,photos:addedPhotos,description,
                perks,extraInfo,checkIn,checkOut,maxGuests,price,
            });
            await carDoc.save();
            res.json('ok');
        }
    });
});

app.get('/cars', async (req, res) => {
    try {
        const cars = await Car.find().populate('owner');
        const carsWithValidOwners = cars.filter(car => car.owner !== null);

        res.json(carsWithValidOwners);// make sure that deleted users cars dont appear
    } catch (e) {
        console.error('Error fetching cars:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/trips', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    const {
        car,checkIn,checkOut,numberOfGuests,name,phone,price,
    } = req.body;
    Trip.create({
        car,checkIn,checkOut,numberOfGuests,name,phone,price,
        user:userData.id,
    }).then((doc) => {
        res.json(doc);
    }).catch((err) => {
        throw err;
    });
});

app.get('/trips', async (req,res) =>{
    const userData = await getUserDataFromReq(req);
    res.json( await Trip.find({user:userData.id}).populate('car') );
});

// pour afficher le statut du trip dans my cars - PAS NECESSAIRES
app.get('/user-trips', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        const trips = await Trip.find({ user: userData.id }).populate('car');
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user trips' });
    }
});

// pour la page TripDetails
app.get('/trips/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id)
            .populate({
                path: 'car',
                populate: {
                    path: 'owner',
                    model: 'User'
                }
            })
            .populate('user');
        
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to accept reservation
app.put('/trips/:id/accept', async (req, res) => {
    const { id } = req.params;
    try {
        const userData = await getUserDataFromReq(req);
        const userId = userData.id; // Get the authenticated user's ID

        const trip = await Trip.findById(id).populate('car');
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        const car = await Car.findById(trip.car._id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        if (car.owner.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        trip.status = 'confirmed';
        await trip.save();

        res.json(trip);
    } catch (error) {
        console.error('Error accepting reservation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//

app.listen(4000, () => {
    console.log('Server running on port 4000');
});
