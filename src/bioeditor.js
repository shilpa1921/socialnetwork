import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textAreaVisible: false,
            draftBio: null,
        };
        console.log("BIOEDITOR state", this.state, props);
    }

    //pick up text input
    handleChange(e) {
        this.setState(
            {
                draftBio: e.target.value,
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
                    this.props.receiveBio(response.data.bio);

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
            <div className="bio-edit">
                {!this.props.bio && (
                    <div id="addbio" onClick={() => this.toggleText()}>
                        Add your bio
                    </div>
                )}
                {this.props.bio && (
                    <div className="showbio">
                        <div id="bio">{this.props.bio}</div>
                        <div id="addbio" onClick={() => this.toggleText()}>
                            Edit
                        </div>
                    </div>
                )}
                {this.state.textAreaVisible && (
                    <div className="enterbio">
                        <textarea
                            defaultValue={this.props.bio}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button onClick={(e) => this.saveBio(e)}>Save</button>{" "}
                    </div>
                )}
            </div>
        );
    }
}
