import React, { useState } from "react";
import { NavLink } from 'react-router-dom'

const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const onClickData = async () => {
        console.log(firstName, lastName, email, password);
        if (!firstName || !lastName || !email || !password) {
            setError(true)
            return false;
        }
        let result = await fetch('http://localhost:4000/register', {
            method: 'post',
            body: JSON.stringify({ firstName, lastName, email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json()
        console.log(result);
        alert("Registration Successful!");
    }

    return (
        <div className="register">
            <h1>Register</h1>
            <input className="inputBox" type="text"
                value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" />
            {error && !firstName && <span className="invalid-input">Please enter valid first name</span>}

            <input className="inputBox" type="text"
                value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" />
            {error && !lastName && <span className="invalid-input">Please enter valid last name</span>}


            <input className="inputBox" type="text"
                value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your e-mail" />
            {error && !email && <span className="invalid-input">Please enter your email </span>}

            <input className="inputBox" type="password"
                value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
            {error && !password && <span className="invalid-input">Please enter password</span>}

            <button onClick={onClickData} className="appButton" type="button">Sign Up</button>
            <div className="nav_link">
                Already Have an account? <NavLink to="/login">Login</NavLink>
            </div>
        </div>
    )
}

export default SignUp;