import { Logo } from "./Logo.tsx";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle.tsx";
import { NavLink } from "react-router-dom";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="header">
      <div className="container row">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="nav-toggle-btn"
          aria-label="open navigation"
        >
          <span className={`hamburger ${isOpen ? "open" : ""}`}></span>
        </button>
        <Logo />
        <nav className={`nav ${isOpen ? "nav--visible" : ""}`}>
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink onClick={handleClick} to="/" className="nav__link">
                Home
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                  onClick={handleClick}
                  to="/have-fun"
                  className="nav__link"
              >
                Have fun
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                  onClick={handleClick}
                  to="/surprise-of-the-day"
                  className="nav__link"
              >
                your daily's surprise
              </NavLink>
            </li>
            <li
                className="nav__item cursor-pointer inline-block"
                onClick={handleClick}
            >
              <ThemeToggle/>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
