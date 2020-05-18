import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriends, acceptFriendRequest, unfriend } from "./actions";
import ProfilePic from "./profilePic";

export default function Friends() {
    const dispatch = useDispatch();

    const friends = useSelector(
        (state) =>
            state.allFriends &&
            state.allFriends.filter((allFriends) => allFriends.accepted == true)
    );

    console.log("friends", friends);

    const pending = useSelector(
        (state) =>
            state.allFriends &&
            state.allFriends.filter(
                (allfriends) => allfriends.accepted == false
            )
    );

    useEffect(() => {
        dispatch(receiveFriends());
    }, []);

    if (!friends && !pending) {
        return null;
    }

    return (
        <div className="all_friends">
            <div className="accepted_friends">
                <ul>
                    <h2>Your friends</h2>
                    {friends &&
                        friends.map((item) => (
                            <div id="findPeople" key={item.id}>
                                <ProfilePic
                                    first={item.first_name}
                                    last={item.last_name}
                                    imageUrl={item.pic_url}
                                    id={item.id}
                                />
                                <div id="list">
                                    {" "}
                                    {item.first_name} {item.last_name}
                                </div>
                                <button
                                    className="yesbtn"
                                    onClick={() => dispatch(unfriend(item.id))}
                                >
                                    End Friendship
                                </button>
                            </div>
                        ))}
                </ul>
            </div>
            <div className="pending_friends">
                <ul>
                    <h2>Pending friend requests</h2>
                    {pending &&
                        pending.map((item) => (
                            <div id="findPeople" key={item.id}>
                                <ProfilePic
                                    first={item.first_name}
                                    last={item.last_name}
                                    imageUrl={item.pic_url}
                                    id={item.id}
                                />
                                <div id="list">
                                    {" "}
                                    {item.first_name} {item.last_name}
                                </div>
                                <button
                                    className="yesbtn"
                                    onClick={() =>
                                        dispatch(acceptFriendRequest(item.id))
                                    }
                                >
                                    Accept Friend Request
                                </button>
                            </div>
                        ))}
                </ul>
            </div>
        </div>
    );
} //end
