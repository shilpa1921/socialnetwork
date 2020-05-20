import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProfilePic from "./profilePic";

export default function OnlineUsers({ id }) {
    console.log("id in online", id);
    const peopleOnline = useSelector(
        (state) =>
            state.peopleOnline &&
            state.peopleOnline.filter((peopleOnline) => peopleOnline.id != id)
    );

    console.log("These people are online", peopleOnline);
    return (
        <div>
            <h3>These people are online</h3>

            <div>
                {peopleOnline &&
                    peopleOnline.map((id) => {
                        return (
                            <div id="findPeople" key={id.id}>
                                <ProfilePic
                                    first={id.first_name}
                                    last={id.last_name}
                                    imageUrl={id.pic_url}
                                    id={id.id}
                                />
                                <div>
                                    {id.first_name} {id.last_name}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
