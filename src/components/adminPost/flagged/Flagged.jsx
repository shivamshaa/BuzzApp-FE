import React, { useEffect, useState } from 'react'
import "./flagged.css"
import axios from "../../../axios-users"

export default function Flagged(props) {
    const [flagUser, setflagUser] = useState({})

    useEffect(() => {
        axios.get(`/${props.data}`).then(data => {
            setflagUser({
                name: data.data.name
            })
        }).catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <div className="flagWrapper">
            <p className="ptag">{flagUser.name} flagged this post</p>

        </div>
    )
}
