import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../components/Loading";
import { Main } from "../components/Main";
import { Post } from "../components/Post";

const cargarPosts = async (fechaDelUltimoPost) => {
  const query = fechaDelUltimoPost ? `?fecha=${fechaDelUltimoPost}` : "";
  const { data: nuevosPosts } = await axios.get(`/api/posts/feed${query}`);

  return nuevosPosts;
};

const NUMERO_DE_POSTS_POR_LLAMADA = 3;

export const Feed = ({ mostrarError, usuario }) => {
  const [posts, setPosts] = useState([]);
  const [cargandoPostsIniciales, setcargandoPostsIniciales] = useState(true);
  const [cargandoMasPost, setCargandoMasPosts] = useState(false);
  const [todosLosPostsCargados, setTodosLosPostsCargados] = useState(false);

  useEffect(() => {
    const cargarPostsIniciales = async () => {
      try {
        const nuevosPosts = await cargarPosts();
        setPosts(nuevosPosts);
        console.log(nuevosPosts);
        setcargandoPostsIniciales(false);
        revisarSiHayMasPosts(nuevosPosts);
      } catch (error) {
        mostrarError("Hubo un error al cargar tu feed.");
        console.log(error);
      }
    };

    cargarPostsIniciales();
  }, []);

  const actualizarPost = (postOriginal, postActualizado) => {
    setPosts((posts) => {
      const postsActualizados = posts.map((post) => {
        if (post !== postOriginal) {
          return post;
        }
        return postActualizado;
      });
      return postsActualizados;
    });
  };

  const cargarMasPosts = async () => {
    if (cargandoMasPost) {
      return;
    }

    try {
      setCargandoMasPosts(true);
      const fechaDelUltimoPost = posts[posts.length - 1].fecha_creado;
      const nuevosPosts = await cargarPosts(fechaDelUltimoPost);
      setPosts((viejosPosts) => [...viejosPosts, ...nuevosPosts]);
      setCargandoMasPosts(false);
      revisarSiHayMasPosts(nuevosPosts);
    } catch (error) {
      mostrarError("Hubo un problema cargando los siguientes posts.");
      setCargandoMasPosts(false);
    }
  };

  const revisarSiHayMasPosts = (nuevosPosts) => {
    if (nuevosPosts.length < NUMERO_DE_POSTS_POR_LLAMADA) {
      setTodosLosPostsCargados(true);
    }
  };

  if (cargandoPostsIniciales) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (!cargandoPostsIniciales && posts.length === 0) {
    return (
      <Main center>
        <NoSiguesANadie />
      </Main>
    );
  }

  return (
    <Main center>
      <div className="Feed">
        {posts.map((item) => (
          <Post
            key={item._id}
            post={item}
            actualizarPost={actualizarPost}
            mostrarError={mostrarError}
            usuario={usuario}
          />
        ))}
        <CargarMasPosts
          onClick={cargarMasPosts}
          todosLosPostsCargados={todosLosPostsCargados}
        />
      </div>
    </Main>
  );
};

const NoSiguesANadie = () => {
  return (
    <div className="NoSiguesANadie">
      <p className="NoSiguesANadie__mensaje">
        Tu feed no tienes fotos porque no sigues a nadie, o porque no han
        publicado fotos.
      </p>
      <div className="text-center">
        <Link to="/explore" className="NoSiguesANadie__boton">
          Explora Clontagram
        </Link>
      </div>
    </div>
  );
};

const CargarMasPosts = ({ onClick, todosLosPostsCargados }) => {
  if (todosLosPostsCargados) {
    return <div className="Feed__no-hay-mas-posts">No hay mas posts.</div>;
  }
  return (
    <button className="Feed__cargar-mas" onClick={onClick}>
      Ver mas
    </button>
  );
};
