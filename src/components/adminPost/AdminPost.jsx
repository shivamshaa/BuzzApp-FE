import "./adminPost.css"
// import { MoreVert } from "@material-ui/icons"
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import SendIcon from '@material-ui/icons/Send';
import FlagIcon from '@material-ui/icons/Flag';
import DeleteIcon from '@material-ui/icons/Delete';
import { useEffect, useState } from "react";
import axios from "../../axios-users";
import axiosPost from "../../axios-posts"
import Comment from "../comment/Comment";
import moment from "moment"

import { Image } from 'cloudinary-react'
import Spinner from "../UI/spinner/Spinner";
import Flagged from "./flagged/Flagged";

export default function AdminPost(props) {
    const [postedBy, setpostedBy] = useState({
        name: "",
        profilePicture: ""
    })
    const [addComment, setaddComment] = useState({
        value: ""
    })
    const [comments, setcomments] = useState([])
    const [deleted, setdeleted] = useState(false)
    const [flagId, setflagId] = useState([])
    const [showFlagged, setshowFlagged] = useState(false)

    useEffect(() => {
        axios.get(`${props.data.userId}`).then(data => {
            setpostedBy({
                name: data.data.name,
                profilePicture: data.data.profilePicture

            })
        })
    }, [])

    const onDeleteHandler = (id) => {
        setdeleted(true)
        axiosPost.delete(`/${id}`).then(res => {
            setdeleted(false)
            props.updatedPost(true)
        }).catch(err => {
            console.log(err)
        })
    }

    const inputChangeHandler = ({ target }) => {
        setaddComment({ value: target.value })

    }
    const onFlagClickHandler = (data) => {
        setshowFlagged(!showFlagged)
        setflagId(data.flagged)

    }
    
    const onCommentHandler = (id) => {
        axiosPost.put(`/${id}/comment`, addComment).then(data => {
            if (data.status == 200) {
                setaddComment({ value: "" })
                props.updatedPost(true)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const showCommentHandler = (data) => {
        setcomments(data.comments)
    }
    let flag = flagId.map((e, i) => (<Flagged key={i} data={e} />))
    let comment = comments.map((e, i) => (<Comment key={i} data={e} />))
    let deletedPost = deleted ? <span><Spinner />Deleting...</span> : null
    const dropdown = showFlagged ? <div className="dropdown-content">
        {flag}
    </div> : null
    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <img src={postedBy.profilePicture} alt="" className="postProfileImg" />
                        <span className="postUsername">{postedBy.name}</span>
                        <span className="postDate">{props && moment(props.data?.createdAt).fromNow() || ""}</span>
                    </div>
                    <div className="postTopRight">
                        <FlagIcon onClick={() => onFlagClickHandler(props.data)} />
                        <span className="flagCounter">{props && props.data?.flagged?.length || ""}</span>
                        {dropdown}
                        <DeleteIcon onClick={() => onDeleteHandler(props.data._id)} />
                        {deletedPost}
                    </div>
                </div>
                <div className="postCenter">
                    <p className="postText">
                        {props && props.data.desc || ""}
                    </p>
                    <Image className="postCenterImg" cloudName="drkob5xsz" publicId={props && props.data.imgId || ""} />

                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <ThumbUpAltIcon className="likeIcon" />
                        <span className="likeCounter">{props && props.data?.likes?.length || ""}</span>
                        <ThumbDownAltIcon className="dislikeIcon" />
                        <span className="dislikeCounter">{props && props.data?.dislikes?.length || ""}</span>

                    </div>
                    <div className="postBottomRight">
                        <InsertCommentIcon className="postCommentIcon" onClick={() => showCommentHandler(props.data)} />
                    </div>
                </div>
                <div className="comment">
                    <input
                        className="commentInput"
                        onChange={inputChangeHandler}
                        placeholder="Add a comment..."
                        value={addComment.value}
                        required
                    />
                    <SendIcon className="postCommentIconSend" onClick={() => onCommentHandler(props.data._id)} />
                </div>
                {comment}
            </div>
        </div>
    )
}
