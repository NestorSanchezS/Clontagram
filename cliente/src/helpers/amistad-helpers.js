import Axios from "axios";

export const toggleSiguiendo = async (usuario) => {
  let usuarioActulizado;

  if (usuario.siguiendo) {
    await Axios.delete(`/api/amistades/${usuario._id}/eliminar`);
    usuarioActulizado = {
      ...usuario,
      numSeguidores: usuario.numSeguidores - 1,
      siguiendo: false,
    };
  } else {
    await Axios.post(`/api/amistades/${usuario._id}/seguir`);
    usuarioActulizado = {
      ...usuario,
      numSeguidores: usuario.numSeguidores + 1,
      siguiendo: true,
    };
  }
  return usuarioActulizado;
};
