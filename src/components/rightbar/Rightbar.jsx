import "./rightbar.css"
import SearchIcon from '@material-ui/icons/Search';
import { useEffect, useState } from "react";
import axios from "../../axios-users";
import Suggestion from "./suggestion/Suggestion";
import FriendList from "./friendList/FriendList";


export default function Rightbar() {

    const [friends, setfriends] = useState([])
    const [suggestions, setsuggestions] = useState([])
    const [showSuggestions, setshowSuggestions] = useState({
        type: true,
        data: null
    })
    const [showFriends, setshowFriends] = useState({
        type: true,
        data: null
    })

    //friends logic
    useEffect(() => {
        axios.get("/friends/all").then(data => {
            setfriends(data.data)

        }).catch(err => {
            console.log(err)
        })
        return () => {
            setfriends([])
            setshowFriends({
                type: true,
                data: null
            })
        }
    }, [])

    let friendList = [];

    for (let key in friends) {
        friendList.push({
            name: friends[key].name,
            id: friends[key]._id,
            profilePicture: friends[key].profilePicture,
            email: friends[key].email
        });
    }
    let friend = friendList.map((e, i) => (
        <FriendList friendList={e} key={i} />
    ))

    // suggestions logic  
    useEffect(() => {
        axios.get("/suggestions/all").then(data => {
            setsuggestions(data.data)

        }).catch(err => {
            console.log(err)
        })
        return () => {
            setsuggestions([])
            setshowSuggestions({
                type: true,
                data: null
            })
        }
    }, [])

    let suggestedFriends = [];

    for (let key in suggestions) {
        suggestedFriends.push({
            name: suggestions[key].name,
            id: suggestions[key]._id,
            profilePicture: suggestions[key].profilePicture,
            email: suggestions[key].email
        });
    }

    let suggestedFriend = suggestedFriends.map((e, i) => (
        <Suggestion suggestedUser={e} key={i} />
    ))

    //searching logic by name and email friends
    const filterOnChangeFriends = (event) => {
        if (event.target.value) {
            setshowFriends({
                type: false,
                data: false
            })
            const searchedFriend = friendList.find((e) => e.name?.toLowerCase() == event.target.value || e.email?.toLowerCase() == event.target.value)
            setshowFriends((p) => ({ ...p, data: searchedFriend ? searchedFriend : "no user found" }))
        } else {
            setshowFriends({
                type: true,
                data: false
            })
        }
    }

    //searching logic by name and email suggestion
    const filterOnChangeSuggestion = (event) => {
        if (event.target.value) {
            setshowSuggestions({
                type: false,
                data: false
            })
            const searchedSuggestedFriend = suggestedFriends.find((e) => e.name?.toLowerCase() == event.target.value || e.email?.toLowerCase() == event.target.value)
            setshowSuggestions((p) => ({ ...p, data: searchedSuggestedFriend ? searchedSuggestedFriend : "no user found" }))
        } else {
            setshowSuggestions({
                type: true,
                data: false
            })
        }

    }

    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                <ul className="friendList">
                    <span className="friendListItem"><h5>Friends</h5>
                        <input type="text" placeholder="Search..." onChange={filterOnChangeFriends} />
                        <label htmlFor="search"><SearchIcon className="rightbarIcon" /></label>
                    </span>
                    {showFriends.type ? friend : <FriendList friendList={showFriends.data} />}
                </ul>

                <ul className="suggestionList">
                    <span className="suggestionListItem"> <h5>Suggestions</h5>
                        <input type="text" placeholder="Search..." onChange={filterOnChangeSuggestion} />
                        <label htmlFor="search"><SearchIcon className="rightbarIcon" /></label>
                    </span>
                    {showSuggestions.type ? suggestedFriend : <Suggestion suggestedUser={showSuggestions.data} />}
                </ul>

            </div>
        </div>
    )
}
