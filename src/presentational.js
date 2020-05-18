import React from "react";
import Logo from "./logo";
import Logout from "./logout";
import { HashRouter, Link } from "react-router-dom";

export default function Presentational({ first, last, imageUrl, toggleModal }) {
    imageUrl = imageUrl || "/default.png";
    let name = first + " " + last;

    return (
        <div id="presentational">
            <div>
                    <Logo />
            </div>

            <div>
                <img
                    className="profile-pic"
                    src={imageUrl}
                    onClick={toggleModal}
                    alt={name}
                />
            </div>
        </div>
    );
}
