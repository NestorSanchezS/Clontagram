import React, { useState } from "react";
import { Main } from "../components/Main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import { Loading } from "../components/Loading";

export const Upload = ({ history, mostrarError }) => {
  const [imagenUrl, setImagenUrl] = useState("");
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [sendPost, setSendPost] = useState(false);
  const [caption, setCaption] = useState("");

  const handleImagenSelection = async (e) => {
    try {
      setSubiendoImagen(true);
      const file = e.target.files[0];

      const config = {
        headers: {
          "Content-Type": file.type,
        },
      };
      const { data } = await Axios.post("/api/posts/upload", file, config);
      setImagenUrl(data.url);
      setSubiendoImagen(false);
    } catch (error) {
      setSubiendoImagen(false);
      mostrarError(error.response.data);
      console.log(error);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault(); //Esto sirve para no enviar el formulario por defecto si no solo la data
    if (sendPost) {
      return;
    }
    if (sendPost) {
      mostrarError("No se ha terminado de subir la imagen");
      return;
    }

    if (!imagenUrl) {
      mostrarError("Primero selecciona una imagen");
      return;
    }

    try {
      setSendPost(true);
      const body = {
        caption,
        url: imagenUrl,
      };
      await Axios.post("/api/posts", body);
      setSendPost(false);
      history.push("/");
    } catch (error) {
      mostrarError(error.response.data);
    }
  };

  return (
    <Main center>
      <div className="Upload">
        <form onSubmit={handleSubmitPost}>
          <div className="Upload__image-section">
            <SeccionSubirImagen
              imagenUrl={imagenUrl}
              subiendoImagen={subiendoImagen}
              handleImagenSelection={handleImagenSelection}
            />
          </div>
          <textarea
            name="caption"
            className="Upload__caption"
            required
            maxLength="180"
            placeholder="Caption de tu post."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button type="submit" className="Upload__submit">
            Post
          </button>
        </form>
      </div>
    </Main>
  );
};

const SeccionSubirImagen = ({
  imagenUrl,
  subiendoImagen,
  handleImagenSelection,
}) => {
  if (subiendoImagen) {
    return <Loading />;
  } else if (imagenUrl) {
    return <img src={imagenUrl} alt="" />;
  } else {
    return (
      <label className="Upload__image-label">
        <FontAwesomeIcon icon={faUpload} />
        <span>Publica una foto</span>
        <input
          type="file"
          className="hidden"
          name="imagen"
          onChange={handleImagenSelection}
        />
      </label>
    );
  }
};
