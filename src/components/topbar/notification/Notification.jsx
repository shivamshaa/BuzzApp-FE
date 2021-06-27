import axios from "../../../axios-users"
import { useEffect, useState } from "react"
import "./notification.css"
import Spinner from "../../UI/spinner/Spinner"
import * as actions from "../../../store/actions/index"
import { connect } from "react-redux"

const Notification = (props) => {
    
    const [notificationUser, setnotificationUser] = useState({
        name: "",
    })
    const [accepted, setaccepted] = useState(false)
    const [rejected, setrejected] = useState(false)

    const { onFetchUser } = props

    useEffect(() => {
        axios.get(`/${props.userId}`).then(data => {
            setnotificationUser({
                name: data.data.name
            })
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const onAcceptHandler = () => {
        setaccepted(true)
        axios.put(`/${props.userId}/accept`).then(res => {
            setaccepted(false)
            props.onResponse(false)
            onFetchUser();
        }).catch(err => {
            console.log(err)
        })
    }

    const accept = accepted ? <div className="accepted"><Spinner />Friend Request Accepted</div> : null

    const onRejectHandler = () => {
        setrejected(true)
        axios.put(`/${props.userId}/reject`).then(res => {
            setrejected(false)
            props.onResponse(false)
        }).catch(err => {
            console.log(err)
        })
    }

    const reject = rejected ? <div className="rejeted"><Spinner />Friend Request Rejected</div> : null

    return (
        <>
            <div className="notificationWrapper">
                <p className="ptag">{notificationUser.name} sent you a friend request</p>
                {accept}
                {reject}
                <div className="notificationIcon">
                    <button className="accept" onClick={onAcceptHandler}>accept</button>
                    <button className="reject" onClick={onRejectHandler}>reject</button>
                </div>
            </div>

        </>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        loading: state.user.loading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchUser: () => dispatch(actions.fetchUser())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification)
