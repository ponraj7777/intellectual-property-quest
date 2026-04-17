import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const promoteToAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        user.isAdmin = true;
        await user.save();

        console.log(`User ${email} promoted to admin successfully`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

const email = process.argv[2];
if (!email) {
    console.error('Please provide an email: node promoteAdmin.js user@example.com');
    process.exit(1);
}

promoteToAdmin(email);
