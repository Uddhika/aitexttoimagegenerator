import mongoose from "mongoose";

const userSchema = mongoose.Schema({ 
    fname : {
        type: String,
        required: true
    },
    lname : {
        type: String,
        required: true
    },

    email : {
        type: String,
        required: true
    },

    password : {
        type: String,
        required: true
    },

    images: [{type: mongoose.Schema.Types.ObjectId, ref: "Images"}]
},
{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

const imagesSchema = mongoose.Schema({

    image: {
        type: String,
        required: true
    },

    style: {
        type: String,
        required: true
    },

    width: {
        type: Number,
        required: true
    },

    height: {
        type: Number,
        required: true
    },

    user : {type: mongoose.Schema.Types.ObjectId, ref: "User"}
},
{ timestamps: true }
);

const Images = mongoose.model("Images", imagesSchema);

export {
    Images, User
}