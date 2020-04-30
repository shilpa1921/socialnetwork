import React from "react";

import Hello from "./Hello";

import axios from "axios";

// export default function HelloWorld() {
//     return (
//         <div>
//             Hello, World!
//             <Hello />
//         </div>
//     );
// }

export default class HelloWorld extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "shilpa",
            last: "Biradar",
        };
    }

    componentDidMount() {
        axios.get("/some-route").then((res) => {
            this.setState({
                first: "Ashok",
            });
        });

        setTimeout(() => {
            this.setState({
                first: "ANnu",
            });
        }, 3000);
    }

    render() {
        return (
            <div>
                Hello, World! {this.state.first} {this.state.last}
                <Hello surname={this.state.last} />
            </div>
        );
    }
}
