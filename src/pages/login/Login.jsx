import React from 'react'
import "./login.css"

export default function Login() {

    return (
        
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3>Login with Google</h3>
                    <h4>Use Google Id to Login</h4>
                    <h5>DevConnector 2.0</h5> <br />
                    <a href="http://localhost:5500/auth/google"><button className="loginButton">
                        login
                        </button></a>
                </div>
                <div className="loginRight">
                    <h3>Login to your Account</h3>
                    <input type="email" placeholder="TTN Email" />
                    <br />
                    <input type="password" placeholder="Password" />
                    <br />
                    <button className="loginButton">login</button>
                </div>
            </div>

        </div>
    )
}
