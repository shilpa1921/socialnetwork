import React from "react";
import Registration from "./registration";

import { HashRouter, Route } from "react-router-dom";
import Login from "./login";

export default function Welcome() {
    return (
        <div>
            <h1>This is the Welcome component</h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
