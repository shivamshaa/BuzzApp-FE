import { useState } from "react";
import "./suggestion.css"
import { Link } from "react-router-dom";
import axios from "../../../axios-users";
import { PersonAdd } from '@material-ui/icons';

export default function Suggestion({ suggestedUser }) {

    const [reqSent, setreqSent] = useState(false)

    const onAddFriendHandler = (id) => {
        axios.put(`/${id}/addfriend`).then(data => {
            setreqSent(true)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <li className="suggestionUser" key={suggestedUser.id}>
            <img src={suggestedUser.profilePicture} />
            <Link className="Link" to={`/userprofile/${suggestedUser.id}`} >{suggestedUser.name}</Link>
            <button className="addFriend" disabled={reqSent} onClick={() => onAddFriendHandler(suggestedUser.id)}>
                <span className="addFriendItem">
                    <PersonAdd />
                </span>
            </button>
        </li>

    )
}
