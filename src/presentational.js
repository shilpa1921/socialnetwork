import React from "react";

// pass 'props' as an argument to get access to the info being passed down from the parent (App)
// we can also use destructuring to pull up the properties inside props
export default function Presentational({ first, last, imageUrl, toggleModal }) {
    // console.log('props in Presentational: ', props);

    imageUrl = imageUrl || "default.png";
    let name = first + " " + last;

    return (
        <div>
            <img
                className="profile-pic"
                src={imageUrl}
                onClick={toggleModal}
                alt={name}
            />
            <h2>
                my name is {first} {last}.
            </h2>
        </div>
    );
}
