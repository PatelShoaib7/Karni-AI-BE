const { Router } = require("express");
const { getUsersItemList } = require("../API/user");
const UserRouter = Router()

UserRouter.get("/get/item-list" , getUsersItemList)

module.exports= {
    UserRouter : UserRouter
}