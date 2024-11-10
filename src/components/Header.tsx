import {Logo} from "./Logo.tsx";
import React, {useState} from "react";
import {ThemeToggle} from "./ThemeToggle.tsx";
import {Link} from "react-router-dom";

export function Header() {

    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(false);
    };

    return (
        <header className="header">
            <div className="container row">
                <button onClick={() => setIsOpen(!isOpen)} className="nav-toggle-btn" aria-label="open navigation">
                    <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
                </button>
                <Logo/>
                <nav className={`nav ${isOpen ? "nav--visible" : ""}`}>
                    <ul className="nav__list">
                        <li className="nav__item"><Link onClick={handleClick} to="/" className="nav__link">Home</Link>
                        </li>
                        <li className="nav__item"><Link onClick={handleClick} to="/covers" className="nav__link">Have
                            fun</Link></li>
                        <li className="nav__item"><Link onClick={handleClick} to="/useful-links"
                                                        className="nav__link">Links</Link></li>
                        <li className="nav__item cursor-pointer inline-block" onClick={handleClick}>
                            <ThemeToggle/>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;