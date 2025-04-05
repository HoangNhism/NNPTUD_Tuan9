let mongoose = require('mongoose');

let menuSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    URL: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: 'menu',
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('menu', menuSchema);