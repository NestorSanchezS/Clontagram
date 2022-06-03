import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Main } from "../components/Main";
import { Loading } from "../components/Loading";
import { RecursoNoExiste } from "../components/RecursoNoExiste";
import stringToColor from "string-to-color";
import { toggleSiguiendo } from "../helpers/amistad-helpers";
import { useEsMobil } from "../hooks/useEsMobil";
import { Grid } from "../components/Grid";

export const Perfil = ({ mostrarError, usuario, match, logout }) => {
  const [usuarioDueñoDelPerfil, setUsuarioDueñoDelPerfil] = useState(null);
  const [postsDelUsuario, setPostsDelUsuario] = useState([]);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [perfilNoExiste, setPerfilNoExiste] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [enviandoAmistad, setEnviandoAmistad] = useState(false);
  const username = match.params.username;
  const esMobil = useEsMobil();

  useEffect(() => {
    const cargarPostsYUsuario = async () => {
      try {
        const { data: usuario } = await Axios.get(`/api/usuarios/${username}`);
        const { data: posts } = await Axios.get(
          `/api/posts/usuario/${usuario._id}`
        );
        setUsuarioDueñoDelPerfil(usuario);
        setPostsDelUsuario(posts);
        setCargandoPerfil(false);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 400)
        ) {
          setPerfilNoExiste(true);
        } else {
          mostrarError("Hubo ub problema al cargar el perfil");
        }
        setCargandoPerfil(false);
      }
    };

    cargarPostsYUsuario();
  }, [username]);

  const esElPerfilDeLaPersonaLogin = () => {
    return usuario._id === usuarioDueñoDelPerfil._id;
  };

  const handleImagenSeleccionada = async (e) => {
    try {
      setSubiendoImagen(true);
      const file = e.target.files[0];
      const config = {
        headers: {
          "Content-Type": file.type,
        },
      };

      const { data } = await Axios.post("/api/usuarios/upload", file, config);
      setUsuarioDueñoDelPerfil({ ...usuarioDueñoDelPerfil, imagen: data.url });
      setSubiendoImagen(false);
    } catch (error) {
      mostrarError(error.response.data);
      setSubiendoImagen(false);
      console.log(error);
    }
  };

  const onToggleSiguiendo = async () => {
    if (enviandoAmistad) {
      return;
    }
    try {
      setEnviandoAmistad(true);
      const usuarioActulizado = await toggleSiguiendo(usuarioDueñoDelPerfil);
      setUsuarioDueñoDelPerfil(usuarioActulizado);
      setEnviandoAmistad(false);
    } catch (error) {
      mostrarError(
        "Hubo un proeblam siguiendo/dejando de seguir a este usuario. Intenta de nuevo"
      );
      setEnviandoAmistad(false);
      console.log(error);
    }
  };

  if (cargandoPerfil) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (perfilNoExiste) {
    return (
      <Main center>
        <RecursoNoExiste mensaje="El perfil que estas intentando ver no existe" />
      </Main>
    );
  }

  if (usuario == null) {
    return null;
  }

  return (
    <Main>
      <div className="Perfil">
        <ImagenAvatar
          esElPerfilDeLaPersonaLogin={esElPerfilDeLaPersonaLogin}
          usuarioDueñoDelPerfil={usuarioDueñoDelPerfil}
          handleImagenSeleccionada={handleImagenSeleccionada}
          subiendoImagen={subiendoImagen}
        />
        <div className="Perfil__bio-container">
          <div className="Perfil__bio-heading">
            <h2 className="capitalize">{usuarioDueñoDelPerfil.username}</h2>
            {!esElPerfilDeLaPersonaLogin() && (
              <BotonSeguir
                siguiendo={usuarioDueñoDelPerfil.siguiendo}
                toggleSiguiendo={onToggleSiguiendo}
              />
            )}
            {esElPerfilDeLaPersonaLogin() && (
              <BotonLogout logout={logout}></BotonLogout>
            )}
          </div>
          {!esMobil && (
            <DescripcionPerfil usuarioDueñoDelPerfil={usuarioDueñoDelPerfil} />
          )}
        </div>
      </div>
      {esMobil && (
        <DescripcionPerfil usuarioDueñoDelPerfil={usuarioDueñoDelPerfil} />
      )}

      <div className="Perfil__separador">
        {postsDelUsuario.length > 0 ? (
          <Grid posts={postsDelUsuario} />
        ) : (
          <NoHaPosteadoFotos />
        )}
      </div>
    </Main>
  );
};

const DescripcionPerfil = ({ usuarioDueñoDelPerfil }) => {
  return (
    <div className="Perfil__descripcion">
      <h2 className="Perfil__nombre">{usuarioDueñoDelPerfil.nombre}</h2>
      <p>{usuarioDueñoDelPerfil.bio}</p>
      <p className="Perfil__estadisticas">
        <b>{usuarioDueñoDelPerfil.numSiguiendo}</b> following
        <span className="ml-4">
          <b>{usuarioDueñoDelPerfil.numSeguidores}</b>
        </span>
      </p>
    </div>
  );
};

const ImagenAvatar = ({
  esElPerfilDeLaPersonaLogin,
  usuarioDueñoDelPerfil,
  handleImagenSeleccionada,
  subiendoImagen,
}) => {
  let contenido;
  if (subiendoImagen) {
    contenido = <Loading />;
  } else if (esElPerfilDeLaPersonaLogin) {
    contenido = (
      <label
        className="Perfil__img-placeholder Perfil__img-placerholder--pointer"
        style={{
          backgroundImage: usuarioDueñoDelPerfil.imagen
            ? `url(${usuarioDueñoDelPerfil.imagen})`
            : null,
          backgroundColor: stringToColor(usuarioDueñoDelPerfil.username),
        }}
      >
        <input
          type="file"
          onChange={handleImagenSeleccionada}
          className="hidden"
          name="imagen"
        />
      </label>
    );
  } else {
    <div
      className="Perfil__img-placeholder"
      style={{
        backgroundImage: usuarioDueñoDelPerfil.imagen
          ? `url(${usuarioDueñoDelPerfil.imagen})`
          : null,
        backgroundColor: stringToColor(usuarioDueñoDelPerfil.username),
      }}
    ></div>;
  }

  return <div className="Perfil__img-container">{contenido}</div>;
};

const BotonSeguir = ({ siguiendo, toggleSiguiendo }) => {
  return (
    <button onClick={toggleSiguiendo} className="Perfil__boton-seguir">
      {siguiendo ? "Dejar seguir" : "seguir"}
    </button>
  );
};

const BotonLogout = ({ logout }) => {
  return (
    <button className="Perfil__boton-logout" onClick={logout}>
      Logout
    </button>
  );
};

const NoHaPosteadoFotos = () => {
  return <p className="text-center"> Este Usuario no ha postado fotos.</p>;
};
