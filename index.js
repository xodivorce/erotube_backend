import express from 'express';
import dotenv from 'dotenv';
import authConfig from './configs/auth_config.js';
import authRoutes from './routes/auth_routes.js';
import cors from 'cors';

dotenv.config();
const app = express();

authConfig.connectDB();

app.use(express.json());
app.use('/auth', authRoutes);
app.use(cors());

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port: ${process.env.PORT}`);
}   );
app.get('/',(req, res) => {
    res.send("Server: Hey Devs, I'm on..!");
} );