//const auditLogger = require("../Middle//wares/auditLogger");
const { itemSchema } = require("../Models/itemsModel");
const { CartItem } = require('./models/cartItem'); 





const getUsersItemList = async (req, res, next) => {
    try {
        const { page = 1, limit = 10  , searchBy=""} = req.query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        if (pageNumber < 1 || limitNumber < 1) {
            const errorMessage = {
                success: false,
                message: "Page and limit must be greater than 0.",
            };
            //await auditLogger(req, res,next, 400, errorMessage); 
            return res.status(400).json(errorMessage);
        }
        const skip = (pageNumber - 1) * limitNumber;

        const searchFilter = searchBy ? {
            $or: [
                { "Variant SKU": { $regex: searchBy, $options: 'i' } }, // Search by Variant SKU
                { Title: { $regex: searchBy, $options: 'i' } } // Search by Title
            ]
        } : {}; 
        const items = await itemSchema.find(searchFilter).skip(skip).limit(limitNumber);
        const totalItems = await itemSchema.countDocuments(searchFilter);

        const responseBody = {
            success: true,
            data: items,
            pagination: {
                currentPage: pageNumber,
                totalItems,
                totalPages: totalItems ? Math.ceil(totalItems / limitNumber) : totalItems ,
                limit: limitNumber,
            },
        };

        //await auditLogger(req, res,next, 200, responseBody);
        return res.status(200).json(responseBody);

    } catch (error) {
        const errorMessage = {
            success: false,
            message: "Failed to retrieve items.",
            error: error.message,
        };

        //await auditLogger(req, res,next, 500, errorMessage);
        console.error("Error retrieving items:", error.message);
        return res.status(500).json(errorMessage);
    }
};



const addToCart = async (req, res) => {
    try {
        const { userId, itemId, quantity = 1 } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID and is required."
            });
        }
        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: "Item ID is required."
            });
        }

        const existingCartItem = await CartItem.findOne({ userId, itemId });
        if (existingCartItem) {
            existingCartItem.quantity =  existingCartItem.quantity + quantity;
            await existingCartItem.save();
        } else {
            // Create a new cart item
            const newCartItem = new CartItem({ userId, itemId, quantity });
            await newCartItem.save();
        }

        return res.status(201).json({
            success: true,
            message: "Item added to cart successfully."
        });
    } catch (error) {
        console.log("Error adding item to cart:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to add item to cart.",
            error: error.message
        });
    }
};



module.exports = {
    getUsersItemList: getUsersItemList,
    addToCart  : addToCart
}