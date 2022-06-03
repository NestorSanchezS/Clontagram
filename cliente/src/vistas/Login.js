import React, { useState } from "react";
import { Link } from "react-router-dom";
// import Axios from "axios";
import { Main } from "../components/Main";

export const Login = ({ login, mostrarError }) => {
  const [emailYPassword, setEmailYPassword] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setEmailYPassword({
      ...emailYPassword,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(emailYPassword.email, emailYPassword.password);
    } catch (error) {
      mostrarError(error.response.data);
      console.log(error);
    }
  };

  return (
    <Main center={true}>
      <div className="FormContainer">
        <h1 className="Form__titulo">Clontagram</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              value={emailYPassword.email}
              onChange={handleInputChange}
              type="email"
              name="email"
              placeholder="Número de móvil o correo electronico"
              className="Form__field"
            ></input>
            <input
              value={emailYPassword.password}
              onChange={handleInputChange}
              type="password"
              name="password"
              placeholder="Contraseña"
              className="Form__field"
            ></input>
            <button type="submit" className="Form__submit">
              Login
            </button>
            <p className="FormContainer__info">
              ¿No tienes cuenta? <Link to="/SignUp">Registrate</Link>
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
};
