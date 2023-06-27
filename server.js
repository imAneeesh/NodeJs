const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');
const connection = require('./config/database');
const cors = require('cors');
require('dotenv').config();

const app = express();




const MongoStore = require('connect-mongo')(session)


const corsOptions = {
    credentials: true,
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    ///..other options
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MongoStore({ 
    mongooseConnection: connection,
     collection: 'sessions' 
    });

// Configure the session middleware
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 // Equals 1 day
        }
    })
);

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    // console.log('req.session', req.session);
    // console.log('req.session', req.session.passport);
    console.log('req.user', req.user);
    return next();
});

app.use(routes);



app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});




// ====================================================================================================

// //Init Middleware
// app.use(express.json())
// app.use(cors())
// app.use(express.static('FoodX'))


// mongoose.connect('mongodb+srv://imaneesh:Aneesh@cluster0.j4pwkzi.mongodb.net/FoodX', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => {
//         console.log("MongoDB connected");
//         app.listen(port, () => {
//             console.log(`Server started at port ${port}`);
//         });
//     })
//     .catch(err => console.log(err))

// // GET food
// app.get("/api/foodx/", (req, res) => {
//     Food.find()
//         .then(foods => {
//             res.json(foods)
//         })
//         .catch(err => {
//             res.status(500).json({ error: "Error detching products" })
//         })
// })

// // Verify users
// app.post("/api/users/verify", (req, res) => {
//     const { email, password } = req.body;
//     Users.findOne({ email: email })
//         .then((user) => {
//             if (!user) {
//                 res.status(401).json({ error: "Incorrect email or password" });
//                 return;
//             }
//             if (password === user.password) {
//                 res.status(200).json({ message: "User verified" });
//                 console.log("User verified");
//             } else {
//                 res.status(401).json({ error: "Incorrect email or password" });
//             }
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).json({ error: "Internal error please try again" });
//         });

// })

// // POST food
// app.post("/api/foodx/", (req, res) => {
//     const newFood = new Food(req.body);
//     newFood.save()
//         .then(food => {
//             {
//                 res.json(food)
//             }
//         })
//         .catch(err => {
//             res.status(500).json({ error: "Error creating a new product" })
//         })
// });
// // POST User
// app.post("/api/users/register", (req, res) => {
//     const newUser = new Users(req.body);
//     newUser.save()
//         .then(user => {
//             {
//                 res.json(user)
//             }
//         })
//         .catch(err => {
//             res.status(500).json({ error: "Error creating new User" })
//         })
// });

