import React, { useEffect, useState } from 'react'
import Rightbar from "../../components/rightbar/Rightbar";
import LanguageIcon from '@material-ui/icons/Language';
import { PersonAdd } from '@material-ui/icons';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import "./userProfile.css"
import { useParams } from 'react-router';
import axios from '../../axios-users';
import { connect } from 'react-redux';

const UserProfile = (props) => {
    const [userInfo, setuserInfo] = useState({
        name: "",
        designation: "",
        email: "",
        city: "",
        state: "",
        zip: "",
        website: "",
        friendCount: "",
        profilePicture: ""
    })
    const [removed, setremoved] = useState(false)
    const [added, setadded] = useState(false)
    const { id } = useParams()

    useEffect(() => {
        axios.get(`/${id}`).then(data => {
            setuserInfo({
                name: data.data.name,
                designation: data.data.designation,
                email: data.data.email,
                city: data.data.city,
                state: data.data.state,
                zip: data.data.pin,
                website: data.data.website,
                friendCount: data.data.friends.length,
                profilePicture: data.data.profilePicture
            })
            return () => {
                setadded(false)
                setremoved(false)
            }

        }).catch(err => {
            console.log(err)
        })
    }, [id])

    const onAddFriendHandler = () => {
        axios.put(`/${id}/addfriend`).then(data => {
            setadded(true)
        }).catch(err => {
            console.log(err)
        })
    }

    const onRemoveFriendHandler = () => {
        axios.put(`/${id}/removefriend`).then(data => {
            setremoved(true)
        }).catch(err => {
            console.log(err)
        })
    }

    const friendButton = props.user?.friends?.includes(id) && !removed ? <button className="addFriend" onClick={() => onRemoveFriendHandler()}>
        <span className="addFriendItem">
            <RemoveCircleIcon /> <span>Remove Friend</span>
        </span>
    </button> : <button className="addFriend" onClick={() => onAddFriendHandler()}>
        <span className="addFriendItem">
            <PersonAdd /> <span>Add Friend</span>
        </span>
    </button>

    const addedFriend = added ? <button className="addFriend">
        <span>Friend Request Sent !!</span>
    </button> : friendButton

    const cityli = userInfo.city ?
        <li className="userDetailsItem">{userInfo.city}</li> : null

    const stateli = userInfo.state ?
        <li className="userDetailsItem">{userInfo.state}</li> : null

    const zipli = userInfo.zip ?
        <li className="userDetailsItem">{userInfo.zip}</li> : null

    const desig = userInfo.designation ?
        <p>{userInfo.designation}</p> : null


    return (
        <>
            <div className="userContainer">
                <div className="userProfile">
                    <div className="userBanner">
                    </div>
                    <div className="userProfileInfo">
                        <img src={userInfo.profilePicture} alt="" />
                        <h2>{userInfo.name}</h2>
                        <p>{userInfo.email}</p>
                        {desig}
                        <ul className="userDetails">
                            {cityli}
                            {stateli}
                            {zipli}
                            <li className="userDetailsItem">{userInfo.friendCount} friends</li>
                        </ul>
                    </div>
                    <div className="userProfileAction">
                        {addedFriend}
                        <button className="visitWebsite">
                            <span className="visitWebsiteItem">
                                <a href={userInfo.website}>  <LanguageIcon /><span>Visit Website</span>
                                </a>
                            </span>
                        </button>
                    </div>
                </div>

                <div className="suggestions">
                    <Rightbar />
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
}

export default connect(mapStateToProps)(UserProfile)