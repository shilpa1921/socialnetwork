import React from "react";
import axios from "./axios";

import { HashRouter, Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            error1: false,
        };
    }

    handleChange(e) {
        console.log("e.target.value", e.target.value);
        console.log("e.target.name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state: ", this.state)
        );
    }

    submit() {
        console.log("about to submit", this.state);
        axios.post("/register", this.state).then(({ data }) => {
            console.log("data: ", data);
            if (data.success) {
                location.replace("/");
            } else if (data.duplicate) {
                this.setState({
                    error1: true,
                });
            } else {
                this.setState({
                    error: true,
                });
            }
        });
    }

    render() {
        return (
            <div className="reg">
                <h2 id="heading">Please register here</h2>
                {this.state.error && <div>Oops something went wrong!</div>}
                {this.state.error1 && (
                    <div>Email address is already exists please login!</div>
                )}
                <input
                    name="first"
                    autoComplete="off"
                    placeholder="first"
                    required
                    onChange={(e) => this.handleChange(e)}
                />
                <br></br>
                <input
                    name="last"
                    autoComplete="off"
                    placeholder="last"
                    required
                    onChange={(e) => this.handleChange(e)}
                />
                <br></br>
                <input
                    name="email"
                    autoComplete="off"
                    placeholder="email"
                    required
                    onChange={(e) => this.handleChange(e)}
                />
                <br></br>
                <input
                    name="password"
                    placeholder="password"
                    autoComplete="off"
                    type="password"
                    required
                    onChange={(e) => this.handleChange(e)}
                />
                <br></br>
                <button onClick={() => this.submit()}>Register!</button>
                <HashRouter>
                    <div id="login">
                        You already have an account?{" "}
                        <Link to="/login">Login here!</Link>
                    </div>
                </HashRouter>
            </div>
        );
    }
}
