import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./welcome";

import App from "./app";

let elem;
const userIsLoggedIn = location.pathname != "/welcome";

if (userIsLoggedIn) {
    elem = <App />;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
