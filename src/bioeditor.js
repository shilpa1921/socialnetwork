import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textAreaVisible: false,
            draftBio: "",
        };
        console.log("BIOEDITOR state", this.state, props);
    }

    //pick up text input
    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state", this.state)
        );
    }

    toggleText() {
        console.log("toggle text running");
        this.setState({
            textAreaVisible: !this.state.textAreaVisible,
        });
    }

    saveBio() {
        console.log("about to save bio: ", this.state);

        axios
            .post("/saveUserBio", this.state)
            .then((response) => {
                console.log("saveUserBio response.data:", response.data);

                if (response.data.bio) {
                    this.props.saveBio(response.data.bio);
                    this.setState({
                        draftBio: response.data.bio,
                    });

                    this.toggleText();
                } else {
                    console.log("error returning bio");
                }
            })
            .catch((err) => {
                console.log("error in saveUserBio", err);
            });
    }

    render() {
        return (
            <div className="bioeddiv">
                {this.state.draftBio == "" &&
                    this.state.textAreaVisible == false && (
                        <div className="nobio">
                            <button onClick={() => this.toggleText()}>
                                Tell us about yourself
                            </button>
                        </div>
                    )}
                {this.state.draftBio == "" &&
                    this.state.textAreaVisible == true && (
                        <div
                            className="writebio"
                            onChange={(e) => this.handleChange(e)}
                        >
                            <textarea
                                name="bio"
                                type="text"
                                placeholder="tell us about yourself..."
                                //defaultValue={this.props.bio}
                            />

                            <button onClick={() => this.saveBio()}>
                                Save your profile
                            </button>
                        </div>
                    )}
                {this.state.draftBio !== "" &&
                    this.state.textAreaVisible == false && (
                        <div className="savedbio">
                            {bio}
                            <button onClick={() => this.toggleText()}>
                                Edit your profile
                            </button>
                        </div>
                    )}
                {this.state.draftBio !== "" &&
                    this.state.textAreaVisible == true && (
                        <div
                            className="editbio"
                            onChange={(e) => this.handleChange(e)}
                        >
                            <textarea
                                name="bio"
                                type="text"
                                defaultValue={this.props.bio}
                            />

                            <button onClick={() => this.saveBio()}>
                                Save your profile
                            </button>
                        </div>
                    )}
            </div>
        );
    }
}
