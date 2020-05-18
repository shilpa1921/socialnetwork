import React, {useEffect, useRef} from "react";

import {socket} from "./socket";
import {useSelector} from "react-redux";

export default function Chat() {

    const elemref = useRef();

    useEffect(()=>{
        console.log("chat hooks component is mounted");
        // console.log("eleref=", elemref);
        // console.log("scroll type",elemref.current.scrollTop );
        // console.log("client height",elemref.current.clientHeight );
        // console.log("scroll height",elemref.current.scrollHeight );


        elemref.current.scrollTop = elemref.current.scrollHeight - elemref.current.clientHeight;
        
        
        
    },[]);


    const chatMessesges = useSelector(state =>state && state.chatMessesges);

    const keyCheck = e=>{
        // console.log("value", e.target.value);
        // console.log("key pressed", e.key);

        if(e.key == "Enter"){
            e.preventDefault();
            console.log("value", e.target.value);
            socket.emit("my amazing chat messeges", e.target.value);
            e.target.value = "";
            
        }
        
        
    };

    return(
        <div>
            <h2>Welcome to chat</h2>
            <div className = "chat-messeges-container" ref={elemref}>
                <p>Chat Messesges</p>
                <p>Chat Messesges</p>
                <p>Chat Messesges</p>
                <p>Chat Messesges</p>
                <p>Chat Messesges</p>
                <p>Chat Messesges</p>
                <p>Chat Messesges</p>
                <p>Chat Messesges</p>
            </div>
            <textarea placeholder = "Add your chat" onKeyDown = {keyCheck}></textarea>

        </div>
    );
    
}