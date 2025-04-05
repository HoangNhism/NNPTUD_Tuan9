let mongoose = require('mongoose')
let categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },description:{
        type:String,
        default:"",
    }
    ,isDeleted:{
        type:Boolean,
        default:false,
    }
},{
    timestamps:true
})
module.exports = mongoose.model('category',categorySchema)

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  // other fields...
});

module.exports = mongoose.model('Product', productSchema);