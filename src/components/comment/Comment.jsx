import axios from "../../axios-users"
import { useEffect, useState } from "react"
import "./comment.css"

export default function Comment({ data }) {
    const [user, setuser] = useState({
        name: "",
        profilePicture: ""
    })

    useEffect(() => {
        axios.get(`/${data.commentedBy}`).then(data => {
            setuser({
                name: data.data.name,
                profilePicture: data.data.profilePicture
            })
        }).catch(err => {
            console.log(err)
        })
    }, [])
    
    return (
        <div className="comments">
            <div className="commentWrapper">
                <img className="commentProfileImg" src={user.profilePicture} alt="" />
                <div className="commentBody">
                    <span className="commentUser">{user.name} : </span>
                    <span className="commentInfo">{data.comment}</span>
                </div>
            </div>
        </div>
    )
}
