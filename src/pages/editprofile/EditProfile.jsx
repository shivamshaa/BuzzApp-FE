import React, { useEffect, useState } from 'react'
import Rightbar from '../../components/rightbar/Rightbar'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import DoneIcon from '@material-ui/icons/Done';
import "./editProfile.css"
import axios from '../../axios-users';
import { connect } from 'react-redux';
import axiosImg from 'axios';
import * as actions from "../../store/actions/index";

const EditProfile = (props) => {
    const [userUpdated, setuserUpdated] = useState(false)
    const [profileImg, setprofileImg] = useState("")
    const [editUser, seteditUser] = useState({
        fname: "",
        lname: "",
        designation: "",
        website: "",
        gender: "",
        city: "",
        state: "",
        pin: "",
        profilePicture: "",
        birthday: ""
    })

    const { onFetchUser } = props
    useEffect(() => {
        seteditUser({
            fname: props.user.name ? props.user.name.split(" ")[0] : "",
            lname: props.user.name ? props.user.name.split(" ")[1] : "",
            designation: props.user.designation ? props.user.designation : "",
            website: props.user.website ? props.user.website : "",
            gender: props.user.gender ? props.user.gender : "",
            city: props.user.city ? props.user.city : "",
            state: props.user.state ? props.user.state : "",
            pin: props.user.pin ? props.user.pin : "",
            birthday: props.user.birthday ? props.user.birthday : "",
            profilePicture: props.user.profilePicture ? props.user.profilePicture : "",
        })
    }, [props])

    const onChangeHandler = (e, event) => {
        seteditUser({ ...editUser, [event]: e.target.value })
        setuserUpdated(false)
    }

    useEffect(() => {
        if (profileImg == "") return;
        axios.put(`/${props.user._id}`, editUser).then(res => {
            setuserUpdated(true)
            setprofileImg("")
            onFetchUser();
        }).catch(err => {
            console.log(err)
            setprofileImg("")
        })
    }, [editUser.profilePicture])

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (profileImg == "") {
            axios.put(`/${props.user._id}`, editUser).then(res => {
                setuserUpdated(true)
                onFetchUser();
            }).catch(err => {
                console.log(err)
            })
        } else {
            const formData = new FormData()
            formData.append("file", profileImg);
            formData.append("upload_preset", "sxiwvrm4");
            await axiosImg.post("https://api.cloudinary.com/v1_1/drkob5xsz/image/upload", formData).then(res => {
                if (res.status == 200) {
                    seteditUser(prevState => ({ ...prevState, ["profilePicture"]: res.data.url }))
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }

    const updated = userUpdated ? <div className="done"> <DoneIcon /> Succesfully updated!! </div> : null

    return (
        <>
            <div className="editProfile">
                <div className="editProfileWrapper">
                    <div className="editProfileBanner">
                    </div>
                    <div className="editProfileInfo">
                        <img src={props.user && props.user.profilePicture || ""} alt="" />
                        <label htmlFor="file-input" className="editProfileImgLabel">
                            <AddAPhotoIcon className="editProfileInfoIcon" />
                        </label>
                        <input type="file" name="" id="file-input" onChange={(event) => {
                            setprofileImg(event.target.files[0]);
                        }} />
                        <h2>{props.user && props.user.name || "user"}</h2>
                    </div>

                    <div className="userForm">
                        <form onSubmit={onSubmitHandler} className="userFormInfo">
                            <div className="formFormat">
                                <label htmlFor="fnam">First Name</label>
                                <input type="text" value={editUser.fname} placeholder="First Name" onChange={(e) => onChangeHandler(e, "fname")} />
                                <label htmlFor="lnam">Last Name</label>
                                <input type="text" value={editUser.lname} placeholder="Last Name" onChange={(e) => onChangeHandler(e, "lname")} />
                            </div>
                            <div className="formFormat">
                                <label htmlFor="designation">Designation</label>
                                <input type="text" value={editUser.designation} placeholder="Designation" onChange={(e) => onChangeHandler(e, "designation")} />
                                <label htmlFor="website">My Website</label>
                                <input type="text" placeholder="My Website" value={editUser.website} onChange={(e) => onChangeHandler(e, "website")} />
                            </div>
                            <div className="formFormat">
                                <div className='user-gender'>
                                    <label htmlFor='gender'>Gender</label>
                                    <div className='radio-container'>
                                        <input id='female' type='radio' checked={editUser.gender === "female"} name="female" value='female' onChange={(e) => onChangeHandler(e, "gender")} />
                                        <label htmlFor='female'>Female</label>
                                        <input id='male' type='radio' checked={editUser.gender === "male"} value='male' onChange={(e) => onChangeHandler(e, "gender")} />
                                        <label htmlFor='male'>Male</label>
                                    </div>
                                </div>

                                <label htmlFor="birthday">Birthday</label>
                                <input type="date" placeholder="birthday" value={editUser.birthday} onChange={(e) => onChangeHandler(e, "birthday")} />
                            </div>
                            <div className="formFormat">
                                <label htmlFor="city">City</label>
                                <input type="text" placeholder="city" value={editUser.city} onChange={(e) => onChangeHandler(e, "city")} />
                                <label htmlFor="state">State</label>
                                <input type="text" placeholder="state" value={editUser.state} onChange={(e) => onChangeHandler(e, "state")} />
                                <label htmlFor="zip">Zip</label>
                                <input type="number" placeholder="zip" value={editUser.pin} onChange={(e) => onChangeHandler(e, "pin")} />
                            </div>
                            <div className="formFormat">
                                <button type="submit" className="editProfileButton">Submit</button>
                                {updated}
                            </div>
                        </form>
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
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchUser: () => dispatch(actions.fetchUser())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)