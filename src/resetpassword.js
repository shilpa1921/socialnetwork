import React from "react";
import axios from "./axios";
import { HashRouter, Link } from "react-router-dom";
export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            step: 1,
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

    submitEmail(e) {
        // e.preventDefault();
        console.log("about to submit", this.state);
        axios.post("/resetpassword/step1", this.state).then(({ data }) => {
            console.log("data: ", data);
            if (data.success) {
                this.setState({
                    step: 2,
                });
            } else {
                this.setState({
                    error: true,
                });
            }
        });
    }
    submitcode(e) {
        // e.preventDefault();
        console.log("about to submit", this.state);
        axios.post("/resetpassword/verify", this.state).then(({ data }) => {
            console.log("data: ", data);
            if (data.success) {
                this.setState({
                    step: 3,
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
            <div id="passwordreset">
                {this.state.step == 1 && (
                    <div>
                        {this.state.error && (
                            <div>Oops, something went wrong!</div>
                        )}
                        <label for="email">
                            <h3> Please enter your registred email address</h3>
                        </label>
                        <br></br>
                        <input
                            id="email"
                            name="email"
                            placeholder="email address"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <button onClick={() => this.submitEmail()}>
                            Submit
                        </button>
                    </div>
                )}
                {this.state.step == 2 && (
                    <div>
                        {this.state.error && (
                            <div>Oops, something went wrong!</div>
                        )}
                        <label for="code">Enter code</label>
                        <input
                            id="code"
                            name="code"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <br></br>
                        <label for="pass">set new password</label>
                        <input
                            id="pass"
                            name="password"
                            type="password"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <br></br>
                        <button onClick={() => this.submitcode()}>
                            Submit
                        </button>
                    </div>
                )}
                {this.state.step === 3 && (
                    <div>
                        <h2>Successfully reseted your password</h2>
                        <HashRouter>
                            <div>
                                You can now <Link to="/login">log in</Link> with
                                your new password!
                            </div>
                        </HashRouter>
                    </div>
                )}
            </div>
        );
    }
}
