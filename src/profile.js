import React from "react";
import Presentational from "./presentational";
import BioEditor from "./bioeditor";
export default function Profie({
    first,
    last,
    imageUrl,
    toggleModal,
    bio,
    receiveBio,
}) {
    imageUrl = imageUrl || "default.png";
    console.log("props in profile", bio, first, receiveBio);
    return (
        <div>
            <h1>
                {first} {last}
            </h1>
            <img id="pic-in-profile" src={imageUrl}></img>

            <div id="bioeditor">
                <BioEditor bio={bio} receiveBio={receiveBio} />
            </div>
        </div>
    );
}
