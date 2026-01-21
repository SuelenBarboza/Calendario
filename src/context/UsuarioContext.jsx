import { createContext, useContext, useState, useEffect } from "react";

const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

useEffect(() => {
  fetch("http://localhost/Innovatech/Config/GetLoggedUser.php", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Usuário carregado:", data); // <--- veja aqui
      setUsuario(data || null);
    })
    .catch((err) => {
      console.error("Erro ao carregar usuário:", err);
      setUsuario(null);
    });
}, []);


  return (
    <UsuarioContext.Provider value={{ usuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = () => useContext(UsuarioContext);
