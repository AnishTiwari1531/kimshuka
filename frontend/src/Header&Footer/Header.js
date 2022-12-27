import React from "react";
import { Link, useNavigate } from "react-router-dom"

const Header = () => {
    const data = localStorage.getItem("user");
    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/')
    }

    return (
        <div>
            <img
                alt="logo"
                className="logo"
                src="https://static.wixstatic.com/media/2a1378_c3dd219292084d6e86bd4bb694afc605~mv2.png/v1/fit/w_2500,h_1330,al_c/2a1378_c3dd219292084d6e86bd4bb694afc605~mv2.png" />
            {
                data ? <ul className="nav-ul nav-right">
                    <li><Link onClick={logout} to="/login">Welcome {data && JSON.parse(data).user} &nbsp; To Kimshuka! &nbsp; Logout</Link></li>
                </ul>
                    :
                    <ul className="nav-ul nav-right">
                        <li><Link to="/signup">Sign Up</Link></li>
                        <li><Link to="/login">Sign In</Link></li>
                    </ul>
            }
        </div>
    )
    // return (
    //     <div>
    //         <img alt="logo"
    //             className="logo"
    //             src="https://static.wixstatic.com/media/2a1378_c3dd219292084d6e86bd4bb694afc605~mv2.png/v1/fit/w_2500,h_1330,al_c/2a1378_c3dd219292084d6e86bd4bb694afc605~mv2.png" />
    //         <ul className="nav-ul">
    //             {
    //                 auth ? <li><Link onClick={logout} to="/signup">Logout {JSON.parse(auth).firstName}</Link></li>
    //                     : <>
    //                         <li><Link to="/signup">Sign Up</Link></li>
    //                         <li><Link to="/login">Sign In</Link></li>
    //                     </>
    //             }
    //         </ul>
    //     </div>
    // )
}

export default Header;
