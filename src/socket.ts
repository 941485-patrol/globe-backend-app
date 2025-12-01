import { Server, Socket } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

let io: Server;

export const init = (httpServer: http.Server): Server => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.SOCKET_ORIGIN,
            methods: ['GET', 'POST'],
        },
    });
    return io;
};

export const getIo = (): Server => {
    if (!io) {
        throw new Error('Socket.io is not available');
    }
    return io;
};
