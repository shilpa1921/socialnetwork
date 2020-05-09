import React from "react";
import Logo from "./logo";

export default function Presentational({ first, last, imageUrl, toggleModal }) {
    imageUrl = imageUrl || "default.png";
    let name = first + " " + last;

    return (
        <div id="presentational">
            <Logo />

            <img
                className="profile-pic"
                src={imageUrl}
                onClick={toggleModal}
                alt={name}
            />
        </div>
    );
}
