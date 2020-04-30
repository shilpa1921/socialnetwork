import React from "react";

import axios from "axios";

// export default function Hello(props) {
//     console.log("props", props);
//     return <div>Hello, Shilpa {props.surname}</div>;
// }

export default class Hello extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("this.props: ", this.props);
        return <h1>Child component! {this.props.surname}</h1>;
    }
}
