import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { faCompass, faUser } from "@fortawesome/free-regular-svg-icons";

export const Nav = ({ usuario }) => {
  return (
    <nav className="Nav">
      <ul className="Nav__links">
        <li>
          <Link to="/" className="Nav__link">
            Clontagram
          </Link>
        </li>
        {usuario && <LoginRoute usuario={usuario} />}
      </ul>
    </nav>
  );
};

const LoginRoute = ({ usuario }) => {
  return (
    <>
      <li className="Nav__link-push">
        <Link className="Nav__link" to="/upload">
          <FontAwesomeIcon icon={faCameraRetro} />
        </Link>
      </li>
      <li className="Nav__link-margin-left">
        <Link className="Nav__link" to="/explore">
          <FontAwesomeIcon icon={faCompass} />
        </Link>
      </li>
      <li className="Nav__link-margin-left">
        <Link className="Nav__link" to={`/perfil/${usuario.username}`}>
          <FontAwesomeIcon icon={faUser} />
        </Link>
      </li>
    </>
  );
};
