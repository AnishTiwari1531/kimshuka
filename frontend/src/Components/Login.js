import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log(email, password);
        if (!email || !password) {
            setError(true)
            return false;
        }
        let result = await fetch('http://localhost:4000/login', {
            method: 'post',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        console.log(result);
        if (result) {
            localStorage.setItem('user', JSON.stringify(result))
            navigate('/profile')
        } else {
            alert("Please enter correct details")
        }
    }

    return (
        <div className='login'>
            <h1>Login</h1>

            <input className="loginBox" type="text" placeholder='Enter your email'
                value={email} onChange={(e) => setEmail(e.target.value)} />
            {error && !email && <span className="invalid-input">Please enter your email </span>}

            <input className="loginBox" type="password" placeholder='Enter your password'
                value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && !password && <span className="invalid-input">Please enter password</span>}

            <button onClick={handleLogin} className="loginButton" type="button">Sign In</button>
            <div className="nav_link">
                Register an account? <NavLink to="/signup">sign up</NavLink>
            </div>
        </div>
    )
}

export default Login;