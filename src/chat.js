import React, { useEffect, useRef } from "react";

import { socket } from "./socket";
import { useSelector } from "react-redux";
import { HashRouter, Link } from "react-router-dom";

export default function Chat() {
    const elemref = useRef();
    const chatMessages = useSelector((state) => state && state.chatMessages);

    useEffect(() => {
        console.log("chat hooks component is mounted");
        console.log("eleref=", elemref);
        console.log("scroll type", elemref.current.scrollTop);
        console.log("client height", elemref.current.clientHeight);
        console.log("scroll height", elemref.current.scrollHeight);

        elemref.current.scrollTop =
            elemref.current.scrollHeight - elemref.current.clientHeight;
    }, []);

    const keyCheck = (e) => {
        // console.log("value", e.target.value);
        // console.log("key pressed", e.key);

        if (e.key == "Enter") {
            e.preventDefault();
            console.log("value", e.target.value);
            socket.emit("my amazing chat messeges", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div>
            <h2>Welcome to chat</h2>
            <div className="chat-messeges-container" ref={elemref}>
                <div>
                    {chatMessages &&
                        chatMessages.map((message) => (
                            <div key={message.chats_id} id="message-unit">
                                <div id="imgandname">
                                    <Link to={"/user/" + message.user_id}>
                                        <div>
                                            <img
                                                className="profilepicinchat"
                                                src={message.pic_url}
                                                alt={name}
                                            />
                                        </div>

                                        <div>
                                            {message.first_name}{" "}
                                            {message.last_name}
                                        </div>
                                    </Link>
                                </div>
                                <div id="msg">
                                    {/* <div id="date">{message.created_at}</div> */}
                                    <div className="messagetext">
                                        {message.msg}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <textarea
                placeholder="Add your chat"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
