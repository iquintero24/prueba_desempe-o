/* Instructions: Implement the authentication logic here.
You can use localStorage to store the logged-in user.
Use the API (api.js) to query and register users.*/

import { router } from "./route.js";
import { api } from "./api.js"; // Implementa y exporta funciones de API en api.js

export const auth = {
  //implementation of the login function
  login: async (email, pass) => {
    const users = await api.get(`/users?email=${email}`);
    if (users.length === 0 || users[0].password !== pass) {
      throw new Error("Invalid credentials");
    }
    const user = users[0];
    localStorage.setItem("user", JSON.stringify(user)); // Guarda el usuario en localStorage
  },

  // Implementa la función de registro
  register: async (name, email, pass) => {
    // If it doesn't exist, register the user and save it to localStorage
    // Throw an error if the email is already registered
    const existingUser = await api.get(`/users?email=${email}`);
    if (existingUser.length > 0) {
      throw new Error("El email ya está registrado");
    }
    const newUser = { name, email, password: pass, rolId: 2 };
    await api.post("/users", newUser); // Registra el nuevo usuario
  },
  // Implementa la función de logout
  logout: () => {
    // TODO: Elimina el usuario de localStorage y redirige a login
    localStorage.removeItem("user"); // Elimina el usuario guardado
    router();
  },
  // Devuelve true si hay usuario autenticado
  isAuthenticated: () => {
    // TODO: Devuelve true si hay usuario en localStorage
    return !!localStorage.getItem("user"); // Devuelve true si hay un usuario guardado
  },
  // Devuelve el usuario autenticado
  getUser: () => {
    // TODO: Devuelve el usuario guardado en localStorage (o null)
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null; // Devuelve el usuario parseado o null si no existe
  },
};
