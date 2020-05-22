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
        // console.log(" id in deleteAccount function", id);
        const isConfirm = confirm("Please Confirm Deletion Account");
        if (isConfirm) {
            axios.post(`/deleteacoount` + id).then((res) => {
                console.log("response from delete account", res.data[0].id);
                if (res.data[0].id == id) {
                    location.replace("/");
                }
            });
        }
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
                    <button id="yes" onClick={deleteAccount}>
                        Delete your Account
                    </button>
                </div>
            </div>
        </div>
    );
}
