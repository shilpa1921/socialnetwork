import React from "react";
import axios from "./axios";
import Presentational from "./presentational";
import Uploader from "./uploader";
import Logo from "./logo";

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

                {/* <h1>Hello from App</h1> */}
                {/* <h2 onClick={() => this.toggleModal()}>
                    Click here!! Changing uploaderIsVisible state with a
                    method!!
                </h2> */}

                {this.state.uploaderIsVisible && (
                    <Uploader
                        methodInApp={this.methodInApp}
                        receivePicture={(arg) => this.receivePicture(arg)}
                        toggleModal={() => this.toggleModal()}
                    />
                )}
            </div>
        );
    }
}
