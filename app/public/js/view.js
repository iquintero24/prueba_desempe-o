
import { api } from "./api.js";
import {auth} from "./auth.js";
import { router } from "./route.js";

// 🔴 VISTA 404 (cuando la ruta no existe)
export function renderNotFound() {
  document.getElementById("app").innerHTML = `
    <h1 class="notFound"> pagina no encontrada </h1>
  `;
}
