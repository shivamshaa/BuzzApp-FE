import Leftbar from "../../components/leftbar/Leftbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css"

const Home = () => {

    return (
        <>
            <div className="homeContainer">
                <Leftbar />
                <Feed />
                <Rightbar />

            </div>
        </>
    )
}

export default Home