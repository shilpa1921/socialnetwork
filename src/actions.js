import axios from "./axios";

export async function receiveFriends() {
    // receiveFriendsWannabes: will make GET request to server to retrieve the list of friends and wannabes

    const response = await axios.post(`/pendingfriends`);
    console.log("resp: ", response.data);

    return {
        type: "PENDING_FRIENDS",
        allFriends: response.data.allfriends,
    };

    // should return an object with type property and a friendsWannabes property whose value is the array of friends and wannabes from the server
}

export async function acceptFriendRequest(id) {
    // acceptFriendRequest: will make POST request to the server to accept the friendship. The function should return an object with type property and the id of the user whose friendship was accepted.
    const { data } = await axios.post(`/friendship/${id}`, {
        text: "Accept Friend Request",
    });
    return {
        type: "ACCEPT_FRIEND",
        id,
        //something
    };
}

export function chatMessages(msgs) {
    return {
        type: "GET_LAST_MESSAGES",
        msgs,
    };
}

export function chatMessage(userAndChatInfo) {
    return {
        type: "ADD_NEW_MESSAGE",
        userAndChatInfo,
    };
}

export async function unfriend(id) {
    const { data } = await axios.post(`/friendship/${id}`, {
        text: "End Friendship",
    });
    console.log(data);
    return {
        type: "UNFRIEND",
        id,
    };
}
