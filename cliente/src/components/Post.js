import React, { useState } from "react";
import { Link } from "react-router-dom";
import { comentar, toggleLike } from "../helpers/post-helpers";
import { Avatar } from "./Avatar";
import { BotonLike } from "./BotonLike";
import { Comentar } from "./Comentar";

export const Post = ({ post, actualizarPost, mostrarError, usuario }) => {
  const {
    numLikes,
    numComentarios,
    caption,
    comentarios,
    _id,
    url,
    usuario: usuarioDelPost,
    estaLike,
  } = post;

  const [enviandoLike, setEnviandoLike] = useState(false);

  const onSubmitLike = async () => {
    if (enviandoLike) {
      return;
    }

    try {
      setEnviandoLike(true);
      const postActualizado = await toggleLike(post);
      actualizarPost(post, postActualizado);
      setEnviandoLike(false);
    } catch (error) {
      setEnviandoLike(false);
      mostrarError("Hubo un problema modificando el like. Intenta de enuevo");
      console.log(error);
    }
  };

  const onSubmitComentario = async (mensaje) => {
    const postActualizado = await comentar(post, mensaje, usuario);
    actualizarPost(post, postActualizado);
  };

  return (
    <div className="Post-Componente">
      <Avatar usuario={usuarioDelPost} />
      <img src={url} añt={caption} className="Post-Componente__img" />
      <div className="Post-Componente__acciones">
        <div className="Post-Componente__like-container">
          <BotonLike onSubmitLike={onSubmitLike} like={estaLike} />
        </div>
        <p>Like por {numLikes} personas</p>
        <ul>
          <li>
            <Link to={`/perfil/${usuarioDelPost.username}`}>
              <b>{usuarioDelPost.username}</b>
            </Link>{" "}
            {caption}
          </li>
          <VerTodosLosComentarios _id={_id} numComentarios={numComentarios} />
          <Comentarios comentarios={comentarios} />
        </ul>
      </div>
      <Comentar
        onSubmitComentario={onSubmitComentario}
        mostrarError={mostrarError}
      />
    </div>
  );
};

const VerTodosLosComentarios = ({ _id, numComentarios }) => {
  if (numComentarios < 4) {
    return null;
  }

  return (
    <li className="text-grey-dark">
      <Link to={`/post/${_id}`}>ver los {numComentarios} comentarios.</Link>
    </li>
  );
};

const Comentarios = ({ comentarios }) => {
  if (comentarios.length === 0) {
    return null;
  }

  return comentarios.map((comentario) => {
    return (
      <li key={comentario._id}>
        <Link to={`/perfil/${comentario.usuario.username}`}>
          <b>{comentario.usuario.username}</b>
        </Link>{" "}
        {comentario.mensaje}
      </li>
    );
  });
};
