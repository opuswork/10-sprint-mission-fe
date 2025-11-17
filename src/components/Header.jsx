import React from "react";
import { Link } from 'react-router-dom';

function Header () {
    return (
        <>
            <header>
                <Link to="/"><img src="/src/assets/logos/panda_logo.svg" width="153" /></Link>
                <Link to="sign-in.html" id="loginLinkButton" className="button">로그인</Link>
            </header>
        </>
    );
};

export default Header;