const { Router } = require("express");
const user = require("../API/user");
const UserRouter = Router()

UserRouter.get("/get/item/list", user.getUsersItemList)

UserRouter.post("/add/item/cart", user.addToCart)

UserRouter.post("/delete/item/cart", user.removeFromCart)


module.exports = {
    UserRouter: UserRouter
}