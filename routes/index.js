const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const { isAuth } = require('./Auth');
const e = require('express');
const Users = connection.models.Users;
const Items = connection.models.Items;
const Cart = connection.models.Cart;


// router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/dashboard' }));


router.post('/api/user/login', passport.authenticate('local'),  (req, res, next) => {
    res.json({ redirect: '/dashboard' , userId: req.user.id});
});

router.get('/api/user/id', (req, res, next) => {
    console.log("id: ", req.user.id)
    res.json({ userId: req.user.id, data: req.user });
});


router.post('/api/user/delete', (req, res, next) => {
    const uid = req.user.id;
    Users.findOneAndUpdate({ _id: uid }, { isActive: false })
        .then((user) => {
            res.json({ redirect: '/auth' });
        })
        .catch(err => {
            res.status(400).json({ error: 'Email already exists' });
        });
});


router.post('/api/user/register', (req, res, next) => {
    const saltHash = genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const newUser = new Users({
        name: req.body.name,
        email: req.body.email,
        hash: hash,
        salt: salt,
        isActive: true
    });
    newUser.save()
        .then((user) => {
            res.json({ redirect: '/auth' });
        })
        .catch(err => {
            res.status(400).json({ error: 'Email already exists' });
        });
});


router.post('/api/user/edit', (req, res, next) => {
    const uid = req.user.id;
    const { name, email, password } = req.body;
    Users.findOne({ _id: uid , email: email })
        .then((user) => {
            userSalt= user.salt;
            console.log("userSalt: ", userSalt);
            
        })
});



router.get('/api/items', (req, res, next) => {
    Items.find()
        .then(items => {
            res.json(items)
        })
        .catch(err => {
            res.status(500).json({ error: "Error detching Items" })
        })
});

router.post('/api/user/cart/', (req, res, next) => {
    const uid = req.body.uid;
    if(uid === undefined || uid === null || uid === '') {
        res.status(400).json({ error: "Please Login to access" });
    }
    else {
    Cart.find({ userId: uid , inCart:true }) // Update the query to filter by userId
        .then(cart => {
            res.json(cart);
        })
        .catch(err => {
            res.status(500).json({ error: "Error fetching Cart" });
        });
    }
});

router.get('/api/user/cart/count', (req, res, next) => {
    const uid = req.user.id;
    Cart.countDocuments({ userId: uid, inCart:true }) // Update the query to filter by userId and use countDocuments()
        .then(count => {
            res.json({ count });
        })
        .catch(err => {
            res.status(500).json({ error: "Error fetching cart count" });
        });
});


router.post('/api/user/cart/delete', (req, res, next) => {
    const id = req.body.id;
    const uid= req.user.id;
    Cart.updateOne({ _id: id, userId: uid }, { inCart: false }) // Update the query to filter by userId 
        .then(cart => {
            res.json(cart);
        }
        )
        .catch(err => {
            res.status(500).json({ error: "Error deleting from cart" });
        }
        );
});

router.post('/api/user/addToCart', (req, res, next) => {
    const { userId, name, price, image } = req.body;
    const newCart = new Cart({
        userId: userId,
        inCart: true,
        name: name,
        price: price,
        image: image
    });
    if(userId === undefined || userId === null || userId === '') {
        res.status(400).json({ error: "Please Login to Add to Cart" });
    }
    else {
    newCart.save()
        .then(cart => {
            {
                res.json(cart)
            }
        })
        .catch(err => {
            res.status(500).json({ error: "Error creating new Cart" })
        })
    }
});


router.get('/api/user/dashboard', isAuth, (req, res, next) => {
    res.json({
        redirect: '/dashboard'
    })
});


router.get('/api/user/logout', isAuth, (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            // Handle any error that occurred during logout
            return next(err);
        }
        res.clearCookie(req.cookies); // Replace 'cookieName' with the actual name of your cookie
        res.json({ redirect: '/auth' });
    });
});

module.exports = router;