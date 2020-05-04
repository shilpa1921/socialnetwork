import React from "react";
import axios from "./axios";
import { HashRouter, Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
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
        axios.post("/login", this.state).then(({ data }) => {
            console.log("data: ", data);
            if (data.success) {
                location.replace("/");
            } else {
                this.setState({
                    error: true,
                });
            }
        });
    }

    render() {
        return (
            <div className="login">
                <h3 id="head">Please Login here</h3>
                {this.state.error && <div>Oops something went wrong!</div>}

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
                <button onClick={() => this.submit()}>Log in!</button>
                <HashRouter>
                    <div id="register">
                        If you do not have an account yet,{" "}
                        <Link to="/">register here!</Link>
                    </div>
                    <div id="reset">
                        If you forget your password,clock here to reset{" "}
                        <Link to="/resetpassword">forgot password!</Link>
                    </div>
                </HashRouter>
            </div>
        );
    }
}
