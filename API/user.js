//const auditLogger = require("../Middle//wares/auditLogger");
const { CartItems } = require("../Models/CartModel");
const { itemSchema } = require("../Models/itemsModel");






const mongoose = require("mongoose");

const getUsersItemList = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, searchBy = "", itemId = "" } = req.query;
        //const  userId = "6763b5ddf6c3dad45e3f007a" //req.toekn.userId

        //pagination
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        if (pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({
                success: false,
                message: "Page and limit must be greater than 0.",
            });
        }

        // Build search filter
        const searchFilter = {};
        if (searchBy) {
            searchFilter.$or = [
                { "Variant SKU": { $regex: searchBy, $options: "i" } },
                { Title: { $regex: searchBy, $options: "i" } },
            ];
        }
        if (itemId) {
            if (!mongoose.Types.ObjectId.isValid(itemId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid itemId format.",
                });
            }
            searchFilter._id = itemId;
        }

        // Fetch items with pagination
        const skip = (pageNumber - 1) * limitNumber;
        const items = await itemSchema
            .find(searchFilter)
            .skip(skip)
            .limit(limitNumber);

        const totalItems = await itemSchema.countDocuments(searchFilter);

        // Prepare response
        const responseBody = {
            success: true,
            data: items,
            pagination: {
                currentPage: pageNumber,
                totalItems,
                totalPages: Math.ceil(totalItems / limitNumber),
                limit: limitNumber,
            },
        };

        // Save logs (success)
        // await logAuditEntry(req, res, 200, responseBody);

        return res.status(200).json(responseBody);
    } catch (error) {
        console.error("Error retrieving items:", error.message);

        //error response
        const errorMessage = {
            success: false,
            message: "Failed to retrieve items.",
            error: error.message,
        };

        // Save logs (failure)
        // await logAuditEntry(req, res, 500, errorMessage);

        return res.status(500).json(errorMessage);
    }
};




const addToCart = async (req, res) => {
    try {
        const { userId, itemId, quantity = 1 } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                errCode: 1,
                message: "User ID and is required."
            });
        }
        if (!itemId) {
            return res.status(400).json({
                success: false,
                errCode: 1,
                message: "Item ID is required."
            });
        }

        const existingCartItems = await CartItems.findOne({ userId, itemId });
        console.log("--existingCartItems--", existingCartItems)
        if (existingCartItems) {
            existingCartItems.quantity = existingCartItems.quantity + quantity;
            await existingCartItems.save();
        } else {
            // Create a new cart item
            const itemAddedToCartResult = await CartItems.create({ userId, itemId, quantity })
            console.log("--itemAddedToCartResult--", itemAddedToCartResult)
        }
        //Save Logs in DB before sending resposne
        return res.status(201).json({
            success: true,
            errCode: 1,
            message: "Item added to cart successfully."
        });
    } catch (error) {
        console.log("Error adding item to cart:", error.message);
        //Save Logs in DB before sending resposne
        return res.status(500).json({
            success: false,
            message: "Failed to add item to cart.",
            error: error.message
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User is required."
            });
        }
        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: "ID is required."
            });
        }

        const result = await CartItems.deleteOne({ userId, itemId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart."
            });
        }
        //Svae log before sending response
        return res.status(200).json({
            success: true,
            errCode: 1,
            message: "Item removed from cart successfully."
        });
    } catch (error) {
        console.error("Error removing item from cart:", error.message);
        //Svae log before sending response
        return res.status(500).json({
            success: false,
            errCode: -1,
            message: "Failed to remove item from cart.",
            error: error.message
        });
    }
};



module.exports = {
    getUsersItemList: getUsersItemList,
    addToCart: addToCart,
    removeFromCart: removeFromCart
}