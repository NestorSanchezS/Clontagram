import React, { useState } from "react";
import { Link } from "react-router-dom";
// import Axios from "axios";
import { Main } from "../components/Main";
import imageSignup from "../images/signup.png";

export const SingUp = ({ signup, mostrarError }) => {
  const [usuario, setUsuario] = useState({
    email: "",
    username: "",
    password: "",
    bio: "",
    nombre: "",
  });

  const handleInputChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(usuario);
    } catch (error) {
      mostrarError(error.response.data);
      console.log(error);
    }
  };

  return (
    <Main center={true}>
      <div className="Signup">
        <img src={imageSignup} alt="Mi compa" className="Signup__img" />
        <div className="FormContainer">
          <h1 className="Form__titulo">Clontagram</h1>
          <p className="FormContainer__info">
            Regristate para que veas el clon de instagram
          </p>
          <form onSubmit={handleSubmit}>
            <input
              value={usuario.email}
              onChange={handleInputChange}
              type="email"
              name="email"
              placeholder="Número de móvil o correo electronico"
              className="Form__field"
              required
            ></input>
            <input
              value={usuario.name}
              onChange={handleInputChange}
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              className="Form__field"
              required
              minLength="3"
              maxLength="100"
            ></input>
            <input
              value={usuario.username}
              onChange={handleInputChange}
              type="text"
              name="username"
              placeholder="Nombre de Usuario"
              className="Form__field"
              required
              minLength="3"
              maxLength="30"
            ></input>
            <input
              value={usuario.bio}
              onChange={handleInputChange}
              type="text"
              name="bio"
              placeholder="Cuentanos de ti..."
              className="Form__field"
              required
              maxLength="150"
            ></input>
            <input
              value={usuario.password}
              onChange={handleInputChange}
              type="password"
              name="password"
              placeholder="Contraseña"
              className="Form__field"
              required
            ></input>

            <button className="Form__submit" type="submit">
              Registrate
            </button>
            <p className="FormContainer__info">
              ¿Tienes una cuenta?<Link to="/login">Entrar</Link>
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
};
