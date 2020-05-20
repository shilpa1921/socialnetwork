// import React from "react";
import * as io from "socket.io-client";
import {
    chatMessages,
    chatMessage,
    peopleOnline,
    peopleOffline,
} from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("chatMessage", (userAndChatInfo) => {
            console.log(`
            I can see my new chat message in the client! I'm about to start the whole Redux process by dispatching here. My msg is ${userAndChatInfo}`);
            store.dispatch(chatMessage(userAndChatInfo));
        });
        socket.on("peopleOnline", (people) =>
            store.dispatch(peopleOnline(people))
        );
    }
};
