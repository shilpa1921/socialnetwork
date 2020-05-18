import React from "react";

import { HashRouter, Route, Link } from "react-router-dom";


import Logout from "./logout"

export default function Logo() {
    return (
        <div id="nav">
                <div id="logo">
                    <img src="/logo.png" />
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
            </div>
      
    );
}
