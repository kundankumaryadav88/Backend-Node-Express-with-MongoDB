const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    productname: String,
    productprice: Number,
    productDescription:String,
    inventroy: Number,
});

module.exports = mongoose.model('product', productSchema, 'products');