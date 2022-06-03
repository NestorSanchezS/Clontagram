import React, { useState } from "react";

export const Comentar = ({ onSubmitComentario, mostrarError }) => {
  const [mensaje, setMensaje] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (enviandoComentario) {
      //Para que el usuario no le pueda dar 10 veces seguidas al boton
      return;
    }

    try {
      setEnviandoComentario(true);
      await onSubmitComentario(mensaje);
      setMensaje("");
      setEnviandoComentario(false);
    } catch (error) {
      setEnviandoComentario(false);
      mostrarError(
        "Hubo un problema guardando el comentario, por favor intenta de nuevo."
      );
    }
  };

  return (
    <form className="Post__comentario-form-container" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Deja un comentario..."
        required
        maxLength="180"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />
      <button type="submit">Post</button>
    </form>
  );
};
