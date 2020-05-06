import React from "react";
import Logo from "./logo";
import ProfilePic from "./profilepic";

export default function Presentational({ first, last, imageUrl, toggleModal }) {
    // console.log("Props in Presentational: ", props);

    return (
        <div className="head">
            <ProfilePic
                first={first}
                last={last}
                imageUrl={imageUrl}
                toggleModal={toggleModal}
            />
        </div>
    );
}
