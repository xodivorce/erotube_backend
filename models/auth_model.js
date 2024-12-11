import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: false, // Optional field
        trim: true, // Automatically removes extra spaces
    },
    email: {
        type: String,
        required: true, // Make sure every user has an email
        unique: true, // Ensure no duplicate emails
        trim: true, // Removes leading/trailing spaces
    },
    password: { 
        type: String, 
        required: true, // Make password mandatory
        minlength: 6, // Enforce a minimum length for security
    },
    otp: {
        type: String, // OTP field (string to handle different formats)
        required: false, // Optional since it’s temporary
    },
    expiresAt: { 
        type: Date, // Fix: Ensure this is a proper date type
        required: false, // Optional, only used with OTP
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Auth = mongoose.model("Auth", authSchema);

export default Auth;
