import React, { useEffect, useState } from "react";

export const useEsMobil = () => {
  const [esMobil, setEsMobil] = useState(null);

  useEffect(() => {
    const mql = window.matchMedia("(min-width:576px)");

    mql.addListener(revisarSiEsMobil);

    const revisarSiEsMobil = () => {
      if (mql.matches) {
        setEsMobil(false); //Si la pantalla es mas grande que 576px no es mobil
      } else {
        setEsMobil(true);
      }
    };
    revisarSiEsMobil();
    return () => mql.removeListener(revisarSiEsMobil);
  }, []);

  return esMobil;
};
