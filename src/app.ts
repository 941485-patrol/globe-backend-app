import express, { Request, Response, NextFunction } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import taskRoutes from './task/routes/task.js';
import userRoutes from './user/routes/user.js';
import { init as initSocket } from './socket.js';
import { Socket } from 'socket.io';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: 'Welcome To My Backend API!!',
  });
});

app.use('/todo', taskRoutes);
app.use('/user', userRoutes);

// For error handling.
interface AppError extends Error {
  statusCode?: number;
  data?: unknown;
}

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const port = process.env.PORT || 3032;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined');
}

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log('Successfully connected to MongoDB!');

    // For config with http and with socket IO.
    const server = app.listen(port, () => {
      console.log(`Server is listening on  ${port}.`);
    });

    console.log('Initializing socket IO...')

    const io = initSocket(server);

    // For config with no Socket IO
    // app.listen(port, () => {
    //   console.log(`Server is listening on port ${port}.`);
    // });

    io.on('connection', (socket: Socket) => {
      console.log('Client connection established.');
    });

  })
  .catch((err) => {
    console.log(err);
  });