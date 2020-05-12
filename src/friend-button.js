import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendshipButton({ otherUserId }) {
    console.log("otherid", otherUserId);
    const [buttonText, setButtonText] = useState("Make Friend request");
    useEffect(() => {
        console.log("I am Friend button Mounting");
        axios.post(`/friendshipstatus/${otherUserId}`).then((resp) => {
            console.log("response in friendshipstatus/", resp.data.text);
            setButtonText(resp.data.text);
        });
    }, []);

    function submit() {
        console.log("i am in friend-button submit function ");
        axios
            .post(`/friendship/${otherUserId}`, { text: buttonText })
            .then(({ data }) => {
                console.log("This is the data: ", data);
                setButtonText(data.text);
            })
            .catch((err) => {
                console.log("Error in axios.post /friendship: ", err);
            });
    }
    return (
        <div>
            <button onClick={submit} className="btn">
                {buttonText}
            </button>
        </div>
    );
}
