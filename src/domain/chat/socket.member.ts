import {
    Socket,
} from "socket.io";

export default class SocketMember extends Socket {
    memberId: string;
}