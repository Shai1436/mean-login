var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var File = new Schema({

    name: {
      type:String,
      required: true
    },

    size: {
      type:Number,
      required: false
    },
    location: {
      type:String,
      required: false
    },

    file:  {
        type: Boolean,
        default: false
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('File', File);