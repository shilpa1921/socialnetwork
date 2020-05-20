export default function reducer(state = {}, action) {
    if (action.type == "PENDING_FRIENDS") {
        state = {
            ...state,
            allFriends: action.allFriends,
        };
    }
    if (action.type == "ACCEPT_FRIEND") {
        state = {
            ...state,
            allFriends: state.allFriends.map((friends) => {
                if (friends.id == action.id) {
                    return {
                        ...friends,
                        accepted: true,
                    };
                } else {
                    return friends;
                }
            }),
        };
        console.log("state111: ", state);
    }
    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            allFriends: state.allFriends.filter(
                (friend) => friend.id != action.id
            ),
        };
        console.log("state: ", state);
    }
    if (action.type == "GET_LAST_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.msgs,
        };
    }

    if (action.type == "ADD_NEW_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.userAndChatInfo],
        };
    }
    if (action.type == "THEY_ONLINE") {
        state = {
            ...state,
            peopleOnline: action.people,
        };
        console.log("state in reducer", state);
    }

    return state;
}

// RECEIVE_FRIENDS_WANNABES: should clone the global state, and add to it a property called friendsWannabes whose value is the array of friends and wannabes

// ACCEPT_FRIEND_REQUEST: should clone the global state, and the clone should have all the properties of the old state except one of the objects in the friendsWannabes array should have their accepted property set to true. All done immutably :)

// UNFRIEND: should clone the global state, and the clone should have all the properties of the old state except the user whose friendship was ended should be removed from the friendsWannabes array. All done immutably :)
