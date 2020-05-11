import React, { useState, useEffect } from "react";
import axios from "./axios";
import ProfilePic from "./profilePic";

export default function FindPeople() {
    const [user, setUser] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        let abort;
        console.log("useEffect runs!");
        axios.post("/findpeople", { user }).then(({ data }) => {
            console.log("data from flame egg: ", data);

            if (!abort) {
                setUsers(data);
            }
        });

        return () => {
            abort = true;
        };
    }, [user]);

    return (
        <div>
            <p>Find People!!</p>
            <input
                onChange={(e) => setUser(e.target.value)}
                placeholder="type the name"
            />
            <p>Check out who just joined</p>
            {/* <input onChange={(e) => setFirst(e.target.value)} />
            <input onChange={(e) => setCountry(e.target.value)} /> */}
            <ul>
                {users.map((user) => (
                    <div id="findPeople" key={user.id}>
                        <div>
                            <div>
                                <ProfilePic
                                    first={user.first_name}
                                    last={user.last_name}
                                    imageUrl={user.pic_url}
                                />
                            </div>
                            <div id="list">
                                {user.first_name} {user.last_name}
                            </div>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
}
