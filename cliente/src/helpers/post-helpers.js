import Axios from "axios";

export const toggleLike = async (post) => {
  const url = `/api/posts/${post._id}/likes`;
  let postConLikeActulizado;

  if (post.estaLike) {
    await Axios.delete(url, {});
    postConLikeActulizado = {
      ...post,
      estaLike: false,
      numLikes: post.numLikes - 1,
    };
  } else {
    await Axios.post(url, {});
    postConLikeActulizado = {
      ...post,
      estaLike: true,
      numLikes: post.numLikes + 1,
    };
  }

  return postConLikeActulizado;
};

export const comentar = async (post, mensaje, usuario) => {
  const { data: nuevoComentario } = await Axios.post(
    `/api/posts/${post._id}/comentarios`,
    { mensaje }
  );

  nuevoComentario.usuario = usuario;

  const postConComentariosActulizado = {
    ...post,
    comentarios: [...post.comentarios, nuevoComentario],
    numComentarios: post.numComentarios + 1,
  };

  return postConComentariosActulizado;
};
