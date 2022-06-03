import React from "react";
import { Link } from "react-router-dom";

export const Grid = ({ posts }) => {
  const columnas = posts.reduce((columnas, post) => {
    const ultimaColumna = columnas[columnas.length - 1];

    if (ultimaColumna && ultimaColumna.length < 3) {
      ultimaColumna.push(post);
    } else {
      columnas.push([post]);
    }

    return columnas;
  }, []);

  return (
    <div>
      {columnas.map((item, index) => {
        return (
          <div key={index} className="Grid__row">
            {item.map((post) => (
              <GridFoto key={post._id} {...post} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

const GridFoto = ({ _id, url, caption }) => {
  return (
    <Link to={`/post/${_id}`} className="Grid__post">
      <img src={url} alt={caption} className="Grid__post-img" />
    </Link>
  );
};
