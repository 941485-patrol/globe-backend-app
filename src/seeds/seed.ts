import mongoose from "mongoose";
import User from "../user/models/user.js";
import Task from "../task/models/task.js";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

async function seedDatabase() {

    try {

        await mongoose.connect(MONGODB_URI!);

        console.log('Successfully connected to MongoDB for seeding!');

        await User.deleteMany({});
        console.log("User collection cleared.");
        await Task.deleteMany({});
        console.log("Task collection cleared.");

        const usersData = [
            { name: "User One", email: "userone@email.com", password: await bcrypt.hash("password", 12) },
            { name: "User Two", email: "usertwo@email.com", password: await bcrypt.hash("password", 12) },
        ];

        const createdUsers = await User.insertMany(usersData);
        console.log("User collection seeded.");

        const tasksData = [
            { title: "Task One", description: "Description One" },
            { title: "Task Two", description: "Description Two" },
            { title: "Task Three", description: "Description Three" },
            { title: "Task Four", description: "Description Four" },
            { title: "Task Five", description: "Description Five" },
            { title: "Task Six", description: "Description Six" },
        ];

        const tasksToInsert: any[] = [];
        for (const user of createdUsers) {
            for (let i = 0; i < 3; i++) {
                const task = {
                    ...tasksData[i + (createdUsers.indexOf(user) * 3)],
                    user: user._id
                };
                tasksToInsert.push(task);
            }
        }

        await Task.insertMany(tasksToInsert);
        console.log("Task collection seeded.");

        process.exit(0);
    } catch (err: unknown) {
        console.error(err);
        process.exit(0);
    }

}

seedDatabase();
