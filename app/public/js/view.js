
import { api } from "./api.js";
import {auth} from "./auth.js";
import { router } from "./route.js";

// 🔴 VISTA 404 (cuando la ruta no existe)
export function renderNotFound() {
  document.getElementById("app").innerHTML = `
    <div class="notFoundContainer">
        <h1 class="notFound"> pagina no encontrada </h1>
    </div>
   
  `;
}


// 🔐 VISTA LOGIN
export async function showLogin() {
  document.getElementById("app").innerHTML = `
    <div class="container_login">
        <h2>Login</h2>
        <form id="form" class="form_login">
            <input type="email" id="e" placeholder="email">
            <input type="password" id="p" placeholder="pass">
            <button>Entrar</button>
        </form>
        <a href="#/register" data-link>¿No tienes cuenta? Regístrate</a>
    </div>`;

  // 🔒 Al enviar el login
  document.getElementById("form").onsubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.login(e.target.e.value, e.target.p.value); // login con email y pass
      location.hash = "#/dashboard"; // redirige al dashboard
      router(); // actualiza la vista
    } catch (err) {
      alert(err.message); // error de login
    }
  };
}

// 📝 VISTA REGISTRO
export async function showRegister() {
  document.getElementById("app").innerHTML = `
    <div class="container_register">
      <form id="f" class="form_register">
        <h2>Registro</h2>
        <input placeholder="nombre" id="n" class="bg-amber-50 p-3 rounded-2xl">
        <input placeholder="email" id="e" class="bg-amber-50 p-3 rounded-2xl">
        <input type="password" class="bg-amber-50 p-3 rounded-2xl" placeholder="pass" id="p">
        <button class="bg-amber-300 p-3 rounded-2xl">Registrar</button>
      </form>
    </div>`;

  // Al enviar el registro
  document.getElementById("f").onsubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.register(e.target.n.value, e.target.e.value, e.target.p.value); // crea el usuario
      location.hash = "#/dashboard"; // redirige
      router();
    } catch (err) {
      alert(err.message);
    }
  };
}



  