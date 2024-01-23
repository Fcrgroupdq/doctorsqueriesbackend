const mongoose = require("mongoose")

const BlogSchema = mongoose.Schema({
    Url:{type:String,required:true},
    Title:{type:String,required:true},
    MetaTitle :{type:String},
    MetaDescription:{type:String,required:true},
    Description:{type:String,required:true},
    MetaTag:{type:String,required:true},
    FeaturedImage:{type:String,required:true},
    Auther:{Type:String}
})

 
const BlogModel = mongoose.model("blog",BlogSchema)

module.exports = {
    BlogModel
}