import React from "react";
import axios from "./axios";
import Presentational from "./presentational";
import Uploader from "./uploader";
import Logo from "./logo";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import Logout from "./logout";
import { HashRouter, Link } from "react-router-dom";

import FindPeople from "./find-people";

import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        console.log("mounted in app.js");
        axios.post("/user").then((res) => {
            console.log(" Response from /user: ", res.data);
            this.setState({
                first: res.data.first_name,
                last: res.data.last_name,
                imageUrl: res.data.pic_url,
                bio: res.data.bio,
            });
        });
    }

    toggleModal() {
        // console.log('toggleModal function is running!!');
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    receivePicture(arg) {
        console.log("I'm running in App: ", arg);
        this.setState({
            imageUrl: arg,
        });
    }
    receiveBio(arg) {
        console.log("I'm running in bio App: ", arg);
        this.setState({
            bio: arg,
        });
    }
    methodInApp(arg) {
        console.log("Im running in App!!!!! and my argument is: ", arg);
    }

    render() {
        return (
            <div id="app-componenet">
                <BrowserRouter>
                    <Presentational
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                        toggleModal={() => this.toggleModal()}
                    />

                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                toggleModal={() => this.toggleModal()}
                                bio={this.state.bio}
                                receiveBio={(arg) => this.receiveBio(arg)}
                            />
                        )}
                    />

                    <Route exact path="/user/:id" component={OtherProfile} />
                    <Route exact path="/users" component={FindPeople} />

                    {this.state.uploaderIsVisible && (
                        <div id="upload-container">
                            <Uploader
                                methodInApp={this.methodInApp}
                                receivePicture={(arg) =>
                                    this.receivePicture(arg)
                                }
                                toggleModal={() => this.toggleModal()}
                            />
                        </div>
                    )}
                    <Logout />

                    <Link to="/users">users</Link>
                    <br></br>
                    <Link to="/">Profile</Link>
                </BrowserRouter>
            </div>
        );
    }
}
