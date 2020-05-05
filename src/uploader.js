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
        console.log("e.target.files[0]", e.target.files[0]);
        this.setState(
            {
                file: e.target.files[0],
            },
            () => console.log("this file", this.state)
        );
    }

    uploadPic(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/upload-img", formData)
            .then((res) => {
                console.log("Response: ", res);
                this.props.receivePicture(res.data.imageUrl);
                this.props.toggleModal();
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
                <p id="close" onClick={() => this.closeModal()}>
                    X
                </p>
                <div id="file">
                    <input
                        type="file"
                        onChange={(e) => this.handleChange(e)}
                        name="file"
                        accept="image/*"
                    />
                    <button onClick={(e) => this.uploadPic(e)}>Upload</button>
                </div>
            </div>
        );
    }
}
