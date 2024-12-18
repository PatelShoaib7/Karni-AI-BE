const { default: mongoose } = require("mongoose");


const itemsModel = new mongoose.Schema({
    "Handle" :  { type : String },
    "Title" : { type : String },
    "Body" :  { type : String },
    "Vendor" : { type : String },
    "Type" :  { type : String },
    "Tags" :  { type : String },
    "Variant SKU" :  { type : String },
    "Variant Inventory Qty" :  { type : Number },
    "Variant Price" :  { type : Number },
    "Image Src" : { type : String }
})

const itemSchema  = mongoose.model("items", itemsModel);

module.exports ={
    itemSchema : itemSchema
}