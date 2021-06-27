import "./post.css"
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

export default function Post(props) {

    const [postedBy, setpostedBy] = useState({
        name: "",
        profilePicture: ""
    })

    const [addComment, setaddComment] = useState({
        value: ""
    })

    const [deleted, setdeleted] = useState(false)
    const [like, setlike] = useState(props.data.likes.length)
    const [dislike, setdislike] = useState(props.data.dislikes.length)
    const [comments, setcomments] = useState([])
    const [flagged, setflagged] = useState(false)

    useEffect(() => {
        axios.get(`/${props.data.userId}`).then(data => {
            setpostedBy({
                name: data.data.name,
                profilePicture: data.data.profilePicture,
            })
        })
        return () => {
            setdeleted(false)
            setflagged(false)
            setpostedBy({
                name: "",
                profilePicture: ""
            })
            props.updatedPost(false)
        }
    }, [])

    const onLikeHandler = (id) => {
        axiosPost.put(`/${id}/like`).then(res => {
            if (res.status == 201) {
                setlike(like + 1)
            } if (res.status == 200) {
                setlike(like - 1)
            }

        }).catch(err => {
            console.log("post is disliked by you!!")
        })
    }

    const onDislikeHandler = (id) => {
        axiosPost.put(`/${id}/dislike`).then(res => {
            if (res.status == 201) {

                setdislike(dislike + 1)
            } if (res.status == 200) {
                setdislike(dislike - 1)
            }
        }).catch(err => {
            console.log("post is liked by you!!")
        })
    }

    const onFlagHandler = (id) => {
        setflagged(true)
        axiosPost.put(`/${id}/flag`).then(res => {
            setflagged(false)
        })
    }

    const onDeleteHandler = (id) => {
        if (props.data.userId !== props.userId) return;
        setdeleted(true)
        axiosPost.delete(`/${id}`).then(res => {
            setdeleted(false)
            props.updatedPost(true)
        }).catch(err => {
            console.log("You can only delete you posts!!", err)
            props.updatedPost(true)
            setdeleted(false)
        })
    }

    const inputChangeHandler = ({ target }) => {
        setaddComment({ value: target.value })
    }

    const onCommentHandler = (id) => {
        if (!addComment.value) return;
        axiosPost.put(`/${id}/comment`, addComment).then(data => {
            if (data.status == 200) {
                props.updatedPost(true)
                setaddComment({ value: "" })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const showCommentHandler = (data) => {
        setcomments(data.comments)
    }

    let deletedPost = deleted ? <span><Spinner />Deleting...</span> : null
    let comment = comments.map((e, i) => (<Comment key={i} data={e} />))
    let flaggedPost = flagged ? <span><Spinner />Post Flagged</span> : null

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
                        <FlagIcon onClick={() => onFlagHandler(props.data._id)} /><DeleteIcon onClick={() => onDeleteHandler(props.data._id)} />
                        {deletedPost}
                        {flaggedPost}
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
                        <ThumbUpAltIcon className="likeIcon" onClick={() => onLikeHandler(props.data._id)} />
                        <span className="likeCounter">{like}</span>
                        <ThumbDownAltIcon className="dislikeIcon" onClick={() => onDislikeHandler(props.data._id)} />
                        <span className="dislikeCounter">{dislike}</span>

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
