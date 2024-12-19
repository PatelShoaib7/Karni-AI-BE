const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Reference to User
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' }, // Reference to Item
    quantity: { type: Number, default: 1 }, // Quantity of the item in the cart
}, { timestamps: true });

const CartItems = mongoose.model("cartitems", cartItemSchema);

module.exports = { CartItems };
