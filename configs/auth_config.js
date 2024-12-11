import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const authConfig = {

    connectDB: async () => {
        dotenv.config();
        try {
            const db = await mongoose.connect(process.env.MONGOOSE_URI);
            console.log("Connected to: " + db.connection.name);

            db.connection.on("error", (error) => {
                console.error("Database connection error:" + db.connection.error);
            });

        } catch (error) {
            console.error("Failed to connect to MongoDB:", error);
            process.exit(1);

        }

    }
}
export default authConfig;