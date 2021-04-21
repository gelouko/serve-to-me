import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { addUser, sendMessage, updateUser, removeUser } from './src/Chat';
import { User } from './src/Interfaces';

const port = process.env.PORT || 9000;

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const socketsConfig: { [key:string]: { socket: WebSocket, user: User } } = {}

const actions: { [key:string]: (user: User) => User[] } = {
    open: addUser,
    message: sendMessage,
    update: updateUser
}

wss.on('connection', (ws: any) => {
    ws.on('message', (payload: string) => {
        console.log('Received message!', payload);
        const { action, currentUser }: { action: string, currentUser: User } = JSON.parse(payload);

        if (action === 'open') {
            ws['userName'] = currentUser.name
            socketsConfig[ws.userName] = {
                socket: ws,
                user: currentUser
            }
        }

        const newUsers = actions[action](currentUser)

        Object.values(socketsConfig).forEach((socketConfig: { socket: WebSocket, user: User }) => {
            socketConfig.socket.send(JSON.stringify(newUsers));
        })
    });

    ws.on('close', (e: CloseEvent) => {
        const newUsers = removeUser(socketsConfig[ws.userName].user);
        delete socketsConfig[ws.userName];

        Object.values(socketsConfig).forEach((socketConfig: { socket: WebSocket, user: User }) => {
            socketConfig.socket.send(JSON.stringify(newUsers))
        })

        console.log(`Connection for ${ws.userName} closed.`)
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
