import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Main } from "../components/Main";
import { Loading } from "../components/Loading";
import { ImagenAvatar } from "../components/Avatar";
import { Link } from "react-router-dom";
import { Grid } from "../components/Grid";

export const Explore = ({ mostrarError }) => {
  const [posts, setPosts] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    <Main center>
      <Loading />
    </Main>;
  }

  useEffect(() => {
    const CargarPostYUsuario = async () => {
      try {
        const [posts, usuarios] = await Promise.all([
          Axios.get("/api/posts/explore").then(({ data }) => data),
          Axios.get("/api/usuarios/explore").then(({ data }) => data),
        ]);
        setPosts(posts);
        setUsuarios(usuarios);
        setLoading(false);
      } catch (error) {
        mostrarError(error.message);
        console.log(error);
      }
    };

    CargarPostYUsuario();
  }, []);

  return (
    <Main>
      <div className="Explore__section">
        <h2 className="Explore__title">Descubrir usuarios</h2>
        <div className="Explore__usuarios-container">
          {usuarios.map((item) => {
            return (
              <div className="Explore__usuario" key={item._id}>
                <ImagenAvatar usuario={item} />
                <p>{item.username}</p>
                <Link to={`/perfil/${item.username}`}>Ver perfil</Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="Explore__section">
        <h2 className="Explore__title">Explorar</h2>
        <Grid posts={posts} />
      </div>
    </Main>
  );
};
