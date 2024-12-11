import nodemailer from 'nodemailer'; // For sending emails
import crypto from 'crypto'; // For generating secure OTPs
import dotenv from 'dotenv'; // For environment variables
import Auth from "../models/auth_model.js"; // User model for MongoDB
import authConfig from '../configs/auth_config.js';

authConfig.connectDB();
dotenv.config();

// Create a transporter object using custom SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Function to generate a secure OTP
const generateOTP = () => {
    return crypto.randomInt(1000, 9999).toString(); // Generates a 4-digit OTP
};

// Function to send OTP email
const sendOTP = (email, otp) => {
    const mailOptions = {
        from: {
            name: 'Ero Tube',
            address: process.env.SMTP_USER
        },
        to: email,
        subject: 'Password Reset - Ero Tube',
        html: `
        Hello User,<br><br>
        Your one time password is: <b>${otp}</b>.<br><br>
        This OTP is valid for 10 minutes. If you did not request this, please contact us immediately at www.xodivorce.in.<br><br>
        Regards,<br>
        Ero Tube<br>
        2024 © All rights reserved
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
};

// Main function to check user existence, generate OTP, save it, and send email
const generateAndSendOTP = async (email) => {
    try {
        // Check if a user with the given email exists in the database
        const user = await Auth.findOne({ email });
        if (!user) {
            return { success: false, message: "No user found with this email" };
        }

        // Generate an OTP and expiration time
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        // Update user's profile with the OTP and expiration time
        user.otp = otp;
        user.expiresAt = expiresAt;
        await user.save();

        // Send the OTP to the user's email
        sendOTP(email, otp);
        console.log(`OTP sent to ${email} and saved in the database.`);
        return { success: true, message: "OTP sent successfully." };
    } catch (error) {
        console.error('Error during OTP generation and sending:', error);
        return { success: false, message: "Internal server error." };
    }
};


// Example usage
const email = 'prasidmandal79@gmail.com'; // Replace with real/test email
generateAndSendOTP(email).then(result => console.log(result));


export { generateAndSendOTP };
