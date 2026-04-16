import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../config/Roles";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const { auth } = useAuth();
  const [clickedOnBars, setClickedOnBars] = useState(false);
  const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined;
  const roles = decoded?.UserInfo?.roles || [];

  const handleClickedOnBars = () => {
    setClickedOnBars(!clickedOnBars);
  };

  const normalNavbar = (
    <ul className={clickedOnBars ? "nav-menu active" : "nav-menu"}>
      <li className="nav-item">
        <NavLink
          to="/login"
          activeclassname="active"
          className="nav-links"
          onClick={handleClickedOnBars}
        >
          Bejelentkezés
        </NavLink>
      </li>
    </ul>
  );
  const loggedInNavbar = (
    <ul className={clickedOnBars ? "nav-menu active" : "nav-menu"}>
      {roles.includes(ROLES.Admin) ? (
        <li className="nav-item">
          <NavLink
            to="/admin"
            activeclassname="active"
            className="nav-links"
            onClick={handleClickedOnBars}
          >
            Admin panel
          </NavLink>
        </li>
      ) : (
        <></>
      )}
      {roles.includes(ROLES.Admin) || roles.includes(ROLES.Editor) ? (
        <li className="nav-item">
          <NavLink
            to="/newevent"
            activeclassname="active"
            className="nav-links"
            onClick={handleClickedOnBars}
          >
            Új teremfoglalás
          </NavLink>
        </li>
      ) : (
        <></>
      )}
      <li className="nav-item">
        <NavLink
          to="/events"
          activeclassname="active"
          className="nav-links"
          onClick={handleClickedOnBars}
        >
          Teremfoglalások
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/"
          activeclassname="active"
          className="nav-links"
          onClick={handleClickedOnBars}
        >
          Kezdőlap
        </NavLink>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink
          to="/"
          className="nav-logo"
          onClick={clickedOnBars ? handleClickedOnBars : null}
        >
          Teremfoglaló rendszer
        </NavLink>
        {auth?.user ? loggedInNavbar : normalNavbar}
        <div className="nav-icon" onClick={handleClickedOnBars}>
          <FontAwesomeIcon icon={clickedOnBars ? faTimes : faBars} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
