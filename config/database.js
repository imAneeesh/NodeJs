const mongoose = require('mongoose');

require('dotenv').config();


const conn = process.env.DB_STRING;  


const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const FoodSchema = new mongoose.Schema({
    name: String,
    description: String,
    imgURL: String,
    price: Number,
});

const UsersSchema = new mongoose.Schema({
    name: String,
    email: String,
    hash: String,
    salt: String,
    isActive: Boolean
});

const ItemsSchema = new mongoose.Schema({
    name: String,
    description: String,
    imgURL: String,
    price: Number,
});
const CartSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    inCart: Boolean,
    userId: String
});

const Food = connection.model('Food', FoodSchema);
const Admin = connection.model('Admin', {});
const Users = connection.model('Users', UsersSchema);
const Items = connection.model('Items', ItemsSchema);
const Cart = connection.model('Cart', CartSchema);

// module.exports = {
//     Food: Food,
//     Admin: Admin,
//     Users: Users
// };


// const User = connection.model('User', UserSchema);

// Expose the connection
module.exports = connection;