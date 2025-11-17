import React from "react";
import { Link } from 'react-router-dom';

function Footer () {
    return (
        <>
            <footer>
                <div>@codeit -2024</div>
                <div id="footerMenu">
                    <Link to="./privacy.html">Privacy Policy</Link>
                    <Link to="./faq.html">FAQ</Link>
                </div>
                <div id="socialMedia">
                <Link to="https://www.facebook.com/" target="_blank"><img src="/src/assets/logos/facebook-logo.svg" width="20" /></Link>
                <Link to="https://www.twitter.com/" target="_blank"><img src="/src/assets/logos/twitter-logo.svg" width="20" /></Link>
                <Link to="https://www.youtube.com" target="_blank"><img src="/src/assets/logos/youtube-logo.svg" width="20" /></Link>
                <Link to="https://www.instagram.com" target="_blank"><img src="/src/assets/logos/instagram-logo.svg" width="20" /></Link>
                </div>
            </footer>
        </>
    );
};

export default Footer;