import React from 'react'
import "./friendList.css"
import { Link } from "react-router-dom";

export default function FriendList({ friendList }) {

    return (
        <li className="suggestionUser" key={friendList.id}>
            <img src={friendList.profilePicture} />
            <Link className="Link" to={`/userprofile/${friendList.id}`} key={friendList.id}>{friendList.name}</Link>
        </li>
    )
}
