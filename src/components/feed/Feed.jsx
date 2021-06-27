import Share from "../share/Share"
import "./feed.css"
import React, { useEffect, useState, Suspense, useContext } from "react";
import axios from "../../axios-posts";
import axiosUser from "../../axios-users";
import { connect } from "react-redux";
import Spinner from "../UI/spinner/Spinner";

const Post = React.lazy(() => import("../post/Post"))
const AdminPost = React.lazy(() => import("../adminPost/AdminPost"))
const Feed = (props) => {

    const [posts, setposts] = useState([])
    const [adminPosts, setadminPosts] = useState([])
    const [isFetching, setIsFetching] = useState(false);
    const [verify, setverify] = useState(false)
    const [page, setPage] = useState(1);
    const [adminPage, setadminPage] = useState(1)
    const [isAdmin, setisAdmin] = useState(false)
    const [adminView, setadminView] = useState(false)
    const [postLoader, setpostLoader] = useState(false)
    const [updatedPost, setupdatedPost] = useState(false)
    const [showPosts, setshowPosts] = useState(true)
    const [showadminPosts, setshowadminPosts] = useState(true)
    const [verifyInput, setverifyInput] = useState({
        password: ""
    })

    useEffect(() => {
        setpostLoader(true)
        fetchData();
        window.addEventListener('scroll', handleScroll);
        return () => {
            setposts([])
            setIsFetching(false)
            setPage(1)
            setshowPosts(true)
            setshowadminPosts(true)
            setadminPage(1)
            setadminView(false)
            setisAdmin(false)
            setadminPosts([])
            setpostLoader(false)
            setupdatedPost(false)
        }
    }, [updatedPost])

    const handleScroll = () => {
        if (Math.ceil(window.innerHeight + document.documentElement.scrollTop) !== document.documentElement.offsetHeight ||
            isFetching) {
            return;
        }
        setIsFetching(true);
    };

    const fetchData = async () => {
        if (showPosts) {
            axios.get(`/post/all?page=${page}`).then(res => {
                if (res.data.length === 0) {
                    setshowPosts(false)
                    setpostLoader(false)
                } else {
                    setpostLoader(false)
                    setshowPosts(true)
                    setPage(page + 1)
                    setposts(() => {
                        return [...posts, ...res.data]
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        }
        else {
            setpostLoader(false)
        }
    }

    useEffect(() => {
        if (isFetching) {
            fetchMoreListItems();
        }

    }, [isFetching]);

    const fetchMoreListItems = () => {
        setpostLoader(true)
        if (adminView) {
            getFlaggedPost();
        } else {
            fetchData();
        }
        setIsFetching(false);
    };

    useEffect(() => {
        if (props.user?.role === "admin") setisAdmin(true)
    }, [props.user, updatedPost])

    useEffect(() => {
        if (adminView) {
            getFlaggedPost();
        }
        if (!adminView) {
            setshowPosts(true)
        }
    }, [adminView])

    const adminViewHandler = () => {
        setadminView(!adminView)
    }

    const getFlaggedPost = async () => {
        if (showadminPosts) {
            axios.get(`/posts/flagged?adminPage=${adminPage}`).then(res => {
                setpostLoader(false)
                if (res.data.length === 0) {
                    setshowadminPosts(false)
                } else {
                    setshowadminPosts(true)
                    setadminPosts(() => { return [...adminPosts, ...res.data] })
                    setadminPage(adminPage + 1)
                    setupdatedPost(false)
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            setpostLoader(false)
        }
    }

    let post =
        posts?.map((e, i) => (
            <Suspense key={i} fallback="">
                <Post key={i} data={e} updatedPost={setupdatedPost} userId={props.user._id} />
            </Suspense>
        ))

    let adminPost = adminPosts?.map((e, i) => (
        <Suspense key={i} fallback="">
            <AdminPost key={i} data={e} updatedPost={setupdatedPost} />
        </Suspense>
    ));

    const onVerifyClickHandler = () => {
        setverify(!verify)
    }

    const onCheckVerifyHandler = () => {
        axiosUser.put("/verify/user", verifyInput).then(res => {
            setverifyInput({ password: "" })
            setverify(false)

        }).catch(err => {
            console.log(err)
        })
    }

    const onVerifyInputChangeHandler = (event) => {
        setverifyInput(prevState => ({ ...prevState, ["password"]: event.target.value }))
    }

    const verifyCard = verify ? <div className="verifyCard">
        <p>Verify your self as admin</p>
        <p>Enter Password </p>
        <input type="password" onChange={onVerifyInputChangeHandler} />
        <button className="verifyButton" onClick={onCheckVerifyHandler}>Verify</button>
    </div> : null

    const admin = isAdmin ? <div className="switchWrapper"><label className="switch"><input type="checkbox" onClick={adminViewHandler} /><span className="slider round">Admin</span></label> </div> :
        <div className="switchWrapper"><label className="switch"><input type="checkbox" onClick={onVerifyClickHandler} /><span className="slider round">Verify</span></label> </div>

    const loader = postLoader ? <Spinner /> : null

    return (
        <div className="feed">
            <div className="feedWrapper">
                {admin}
                {verifyCard}
                <Share data={props.user} updatedPost={setupdatedPost} />
                <div className="postFeeddWrapper">
                    {loader}
                    {adminView && isAdmin ? adminPost : post}
                </div>
            </div>

        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        loading: state.user.loading,
    };
};

export default connect(mapStateToProps)(Feed)
