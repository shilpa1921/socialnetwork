import React from "react";
import Logo from "./logo";
import Logout from "./logout";
import { HashRouter, Link } from "react-router-dom";

export default function Presentational({ first, last, imageUrl, toggleModal }) {
    imageUrl = imageUrl || "/default.png";
    let name = first + " " + last;

    return (
        <div id="presentational">
            <div id="nav">
                <div>
                    <Link to="/">
                        <Logo />
                    </Link>
                </div>
                <Logout />

                <div>
                    <Link id="navbox" to="/users">
                        Users
                    </Link>
                </div>
                <div>
                    <Link id="navbox" to="/">
                        Profile
                    </Link>
                </div>
                <div>
                    <Link id="navbox" to="/friends">
                        Friends
                    </Link>
                </div>
                <div>
                    <Link id="navbox" to="/chat">
                        Chat
                    </Link>
                </div>
                <div>
                    <Link id="navbox" to="/online">
                        Online
                    </Link>
                </div>
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
