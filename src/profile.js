import React from "react";
import ProfilePic from "./profilePic";
import BioEditor from "./bioeditor";
export default function Profie({
    first,
    last,
    imageUrl,
    toggleModal,
    bio,
    receiveBio,
}) {
    console.log("props in profile", bio, first, receiveBio);
    return (
        <div id="profilepic">
            <ProfilePic
                first={first}
                last={last}
                imageUrl={imageUrl}
                toggleModal={toggleModal}
            />
            <h2>
                my name is {first} {last}.
                <BioEditor bio={bio} receiveBio={receiveBio} />
            </h2>
        </div>
    );
}
