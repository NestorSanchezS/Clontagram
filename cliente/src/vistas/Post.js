import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Main } from "../components/Main";
import { Loading } from "../components/Loading";
import { RecursoNoExiste } from "../components/RecursoNoExiste";
import { Link } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { BotonLike } from "../components/BotonLike";
import { comentar, toggleLike } from "../helpers/post-helpers";
import { Comentar } from "../components/Comentar";

export const PostVista = ({ mostrarError, match, usuario }) => {
  const postId = match.params.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postNoExiste, setPostNoExiste] = useState(false);
  const [enviandoLike, setEnviandoLike] = useState(false);

  useEffect(() => {
    const cargarPost = async () => {
      try {
        const { data: post } = await Axios.get(`/api/posts/${postId}`);
        setPost(post);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 404 || error.response.status === 400) {
          setPostNoExiste(true);
        } else {
          mostrarError("Hubo un problema cargando este post.");
        }
        setLoading(false);
      }
    };
    cargarPost();
  }, [postId]);

  const onSubmitComentario = async (mensaje) => {
    const postActualizado = await comentar(post, mensaje, usuario);
    setPost(postActualizado);
  };

  const onSubmitLike = async () => {
    if (enviandoLike) {
      return;
    }

    try {
      setEnviandoLike(true);
      const postActualizado = await toggleLike(post);
      setPost(postActualizado);
      setEnviandoLike(false);
    } catch (error) {
      setEnviandoLike(false);
      mostrarError("Hubo un problema modificando el like. Intenta de enuevo");
      console.log(error);
    }
  };

  if (loading) {
    <Main center>
      <Loading />
    </Main>;
  }

  if (postNoExiste) {
    return (
      <RecursoNoExiste
        mensaje={"El post que estas intentando ver no existe."}
      />
    );
  }

  if (post == null) {
    return null;
  }

  return (
    <Main center>
      <Post
        {...post}
        onSubmitComentario={onSubmitComentario}
        onSubmitLike={onSubmitLike}
      />
    </Main>
  );
};

const Post = ({
  comentarios,
  caption,
  url,
  usuario,
  estaLike,
  onSubmitLike,
  onSubmitComentario,
}) => {
  return (
    <div className="Post">
      <div className="Post__image-container">
        <img src={url} alt={caption} />
      </div>
      <div className="Post__side-bar">
        <Avatar usuario={usuario} />

        <div className="Post__comentarios-y-like">
          <Comentarios
            usuario={usuario}
            caption={caption}
            comentarios={comentarios}
          />
          <div className="Post__like">
            <BotonLike onSubmitLike={onSubmitLike} like={estaLike} />
          </div>
          <Comentar onSubmitComentario={onSubmitComentario} />
        </div>
      </div>
    </div>
  );
};

const Comentarios = ({ usuario, caption, comentarios }) => {
  return (
    <ul className="Post__comentarios">
      <li className="Post__comentario">
        <Link
          to={`/perfil/${usuario.username}`}
          className="Post__autor-comentario"
        >
          <b>{usuario.username}</b>
        </Link>{" "}
        {caption}
      </li>
      {comentarios.map((item) => (
        <li className="Post__comentario" key={item.id}>
          <Link
            to={`/perfil/${item.usuario.username}`}
            className="Post__autor-comentario"
          >
            <b>{item.usuario.username}</b>
          </Link>{" "}
          {item.mensaje}
        </li>
      ))}
    </ul>
  );
};
