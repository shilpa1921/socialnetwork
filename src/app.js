import React from "react";
import axios from "./axios";
import Presentational from "./presentational";
import Uploader from "./uploader";
import Logo from "./logo";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "Andrea",
            last: "Arias",
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        // console.log('App mounted');
        // here is where we want to make an axios request to 'get' info about logged in user (first name, last name, and profilePicUrl / imageUrl)
        // an axios route `/user` is a good path for it
        // when we finally have the info from the server, you will want to add it to the state of the component (i.e. with setState)
    }

    toggleModal() {
        // console.log('toggleModal function is running!!');
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    methodInApp(arg) {
        console.log("Im running in App!!!!! and my argument is: ", arg);
    }

    render() {
        return (
            <div>
                <Logo />

                <Presentational
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    toggleModal={() => this.toggleModal()}
                />

                <h1>Hello from App</h1>
                <h2 onClick={() => this.toggleModal()}>
                    Click here!! Changing uploaderIsVisible state with a
                    method!!
                </h2>

                {this.state.uploaderIsVisible && (
                    <Uploader
                        methodInApp={this.methodInApp}
                        toggleModal={() => this.toggleModal()}
                    />
                )}
            </div>
        );
    }
}
