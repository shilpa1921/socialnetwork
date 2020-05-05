import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        // console.log("props in uploader", props);
        super();
        this.state = {
            file: null,
        };
    }

    componentDidMount() {
        console.log("Uploader mounted");
    }

    handleChange(e) {
        this.setState({
            file: e.target.files[0],
        });
        console.log("this file", this.file);
    }

    uploadPic(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/upload-img", formData)
            .then((res) => {
                console.log("Response: ", res);
            })
            .catch((err) => {
                console.log("Error in post upload-img: ", err);
            });
    }

    closeModal() {
        console.log("The modal is to be closed");
        this.props.toggleModal();
    }

    render() {
        return (
            <div id="upload">
                <p onClick={() => this.closeModal()}>X</p>

                <input
                    onChange={(e) => this.handleChange(e)}
                    name="file"
                    type="file"
                    accept="image/*"
                />
                <button onClick={(e) => this.uploadPic(e)}>Upload</button>
            </div>
        );
    }
}
