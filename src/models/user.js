const  mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    // firstName: {
    //     type: String,
    //     required: true
    // },
    // lastName: {
    //     type: String,
    //     required: true
    // },
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     lowercase: true,
    //     trim: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
    // age: {
    //     type: Number,
    //     required: true
    // },
    // gender: {
    //     type: String,
    //     required: true,
    //     validate(value) {
    //         if (value === 'male' || value === 'female') {
    //             return true;
    //         }
    //         throw new Error('gender should be male or female');
    //     }
    // },
    // phone: {
    //     type: String,
    //     required: true
    // },
    // photo: {
    //     type: String,
       
    // },
    // about: {
    //     type: String,
        
    //     default: 'this is default about of  the user '
        
    // },
    // skills: {
    //     type: [String],
    //     required: true
    // }
    firstName: {
        type: String,
        required: true
    
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        
    },
    password: {
        type: String,
        required: true
    }
});
const User = mongoose.model('User', userSchema);
module.exports = User;