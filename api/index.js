const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

const { sendConfirmationEmail } = require('./utilities/authEmail.js');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);  //Secret
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
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

app.get('/test', (req, res) => {
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

// delete le cookie dacces
app.post('/logout', (req, res) => {
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

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
});

const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads\\', ''));
    }
    res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const {
        title, address, addedPhotos, description, price,
        perks, extraInfo, checkIn, checkOut, maxGuests,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            console.error('JWT verification error:', err);
            throw err;
        }
        const placeDoc = await Place.create({
            owner: userData.id, price,
            title, address, photos: addedPhotos, description,
            perks, extraInfo, checkIn, checkOut, maxGuests,
        });
        res.json(placeDoc);
    });
});

app.get('/user-places', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            console.error('JWT verification error:', err);
            throw err;
        }
        const { id } = userData;
        res.json(await Place.find({ owner: id }));
    });
});

app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
    const { token } = req.cookies;
    const {
        id, title, address, addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            console.error('JWT verification error:', err);
            throw err;
        }
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos: addedPhotos, description,
                perks, extraInfo, checkIn, checkOut, maxGuests, price,
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
});

app.get('/places', async (req, res) => {
    res.json(await Place.find());
});

// Bookings
app.post('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
    } = req.body;
    Booking.create({
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
        user: userData.id,
    }).then((doc) => {
        res.json(doc);
    }).catch((err) => {
        console.error('Booking create error:', err);
        throw err;
    });
});

app.get('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    res.json(await Booking.find({ user: userData.id }).populate('place'));
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});
