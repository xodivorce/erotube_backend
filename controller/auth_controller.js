import bcrypt from 'bcrypt';
import Auth from "../models/auth_model.js";

async function signup(req, res) {
    const { username, email, password } = req.body;

    // Validate input
    if (!username) {
        return res.status(400).send("Please choose a username.");
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).send("Username can only contain letters and numbers, with no spaces or symbols.");
    }

    if (!email) {
        return res.status(400).send("Please choose an email.");
    }

    if (!password) {
        return res.status(400).send("Please choose a password.");
    }

    try {
        // Check if username or email already exists
        const existingUser = await Auth.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            const message = existingUser.username === username
                ? "This username is already taken. Please choose a different one."
                : "This email is already registered. Please login or use a different email.";
            return res.status(400).send(message);
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const user = new Auth({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.send(`${user.username} created successfully.`);
        console.log(`${user.username} created successfully.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred. Please try again later.");
    }
}

async function login(req, res) {
    const { identifier, password }  = req.body;

    console.log("Login request received with identifier for user:", identifier);

    if (!identifier || !password) {
        return res.status(400).send("Please provide both identifier and password.");
    }

    try {
        // Find the user by email or username
        const user = await Auth.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user) {
            console.log("User not found");
            return res.status(404).send("The email/username doesn't exist.");
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Incorrect password");
            return res.status(401).send("Sorry, your password was incorrect. Please double-check your password.");
        }

        console.log(`${user.username} logged in successfully.`);
        res.send(`${user.username} logged in successfully.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred. Please try again later.");
    }
}

export { signup, login };