const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    name: String,
    description: String,
    imgURL: String,
    price: Number,
});

const UsersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});


const Food = mongoose.model('Food', FoodSchema);
const Admin = mongoose.model('Admin', {});
const Users = mongoose.model('Users', UsersSchema);

module.exports = {
    Food: Food,
    Admin: Admin,
    Users: Users
};
