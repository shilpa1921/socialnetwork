import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./welcome";

let elem;
const userIsLoggedIn = location.pathname != "/welcome";

if (userIsLoggedIn) {
    elem = <h1>I will be the logo....</h1>;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
