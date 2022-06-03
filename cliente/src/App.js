import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SingUp } from "./vistas/SingUp";
import { Nav } from "./components/Nav";
import { Login } from "./vistas/Login";
import {
  deleteToken,
  getToken,
  initAxiosInterceptors,
  setToken,
} from "./helpers/auth-helpers";
import Axios from "axios";
import { Main } from "./components/Main";
import { Loading } from "./components/Loading";
import { Error } from "./components/Error";
import { Upload } from "./vistas/Upload";
import { Feed } from "./vistas/Feed";
import { PostVista } from "./vistas/Post";
import { Explore } from "./vistas/Explore";
import { Perfil } from "./vistas/Perfil";

initAxiosInterceptors();

export default function App() {
  const [usuario, setUsuario] = useState(null);

  const [cargandoUsuario, setCargandoUsuario] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      if (!getToken()) {
        setCargandoUsuario(false);
        return;
      }

      try {
        const { data: usuario } = await Axios.get("/api/usuarios/whoami");
        setUsuario(usuario);
        setCargandoUsuario(false);
      } catch (error) {
        console.log(error);
      }
    };

    cargarUsuario();
  }, []);

  const login = async (email, password) => {
    const { data } = await Axios.post("/api/usuarios/login", {
      email,
      password,
    });
    setUsuario(data.usuario);
    setToken(data.token);
  };

  const signup = async (usuario) => {
    const { data } = await Axios.post("/api/usuarios/signup", usuario);
    setUsuario(data.usuario);
    setToken(data.token);
  };

  const logout = () => {
    setUsuario(null);
    deleteToken();
  };

  const mostrarError = (mensaje) => {
    setError(mensaje);
  };

  const quitarError = () => {
    setError(null);
  };

  if (cargandoUsuario) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  return (
    <Router>
      <Nav usuario={usuario} />
      <Error mensaje={error} quitarError={quitarError} />
      {usuario ? (
        <LoginRoutes
          mostrarError={mostrarError}
          usuario={usuario}
          logout={logout}
        />
      ) : (
        <LogoutRoutes
          login={login}
          signup={signup}
          mostrarError={mostrarError}
        />
      )}
    </Router>
  );
}

const LoginRoutes = ({ mostrarError, usuario, logout }) => {
  return (
    <Switch>
      <Route
        path="/upload"
        render={(props) => <Upload {...props} mostrarError={mostrarError} />}
      />
      <Route
        path="/post/:id"
        render={(props) => (
          <PostVista {...props} mostrarError={mostrarError} usuario={usuario} />
        )}
      />
      <Route
        path="/perfil/:username"
        render={(props) => (
          <Perfil
            {...props}
            mostrarError={mostrarError}
            usuario={usuario}
            logout={logout}
          />
        )}
      />
      <Route
        path="/explore"
        render={(props) => <Explore {...props} mostrarError={mostrarError} />}
      />
      <Route
        path="/"
        render={(props) => (
          <Feed {...props} mostrarError={mostrarError} usuario={usuario} />
        )}
        default
      />
    </Switch>
  );
};

const LogoutRoutes = ({ login, signup, mostrarError }) => {
  return (
    <Switch>
      <Route
        path="/login/"
        render={(props) => (
          <Login {...props} login={login} mostrarError={mostrarError} />
        )}
      />
      <Route
        render={(props) => (
          <SingUp {...props} signup={signup} mostrarError={mostrarError} />
        )}
        default
      />
    </Switch>
  );
};
