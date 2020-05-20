import React from "react";
import Presentational from "./presentational";
import BioEditor from "./bioeditor";
import axios from "./axios";
export default function Profie({
    first,
    last,
    imageUrl,
    toggleModal,
    bio,
    receiveBio,
    id,
}) {
    imageUrl = imageUrl || "default.png";
    console.log("props in profile", bio, first, receiveBio);
    const deleteAccount = () => {
        console.log("shilpa delted", id);
        axios.post(`/deleteacoount` + id).then((res) => {
            console.log("response from delete account", res.data[0].id);
            if (res.data[0].id == id) {
                location.replace("/");
            }
        });
    };
    return (
        <div>
            <h1>
                {first} {last}
            </h1>
            <div id="bio-and-pic">
                <div>
                    <img id="pic-in-profile" src={imageUrl}></img>
                </div>
                <div id="bioeditor">
                    <BioEditor bio={bio} receiveBio={receiveBio} />
                </div>
            </div>
            <button onClick={deleteAccount}>Delete Account</button>
        </div>
    );
}
