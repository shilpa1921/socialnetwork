import React from "react";
import Registration from "./registration";

import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import ResetPassword from "./resetpassword";
import Logo from "./logo";

export default function Welcome() {
    return (
        <div id="welcome">
            <Logo />
            <h1> Welcome to my social network</h1>

            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpassword" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}
