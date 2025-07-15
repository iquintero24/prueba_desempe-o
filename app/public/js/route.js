/* Instructions: Implement the routing and view logic by importing the necessary functions from views.js and auth.js.
You can add, modify, or remove routes as needed for your application.*/


// 🔁 Import authentication functions and views
import { auth } from "./auth.js"; //Session management (login, logout, current user)
import {
  renderNotFound, // Vista 404 si no encuentra la ruta
  showLogin, // Vista login
  showRegister, // Vista registro
  showDashboard, // Vista principal del sistema (autenticado)
  showCourses,
  showCreateCourse,
  showEditCourse,
  // Implementa en views.js
} from "./view.js";

// 📌 Define the valid routes for your SPA application here
// Each key is a hash (#/route) and its value is a function that renders that view.

const routes = {
  "#/login": showLogin,
  "#/register": showRegister,
  "#/dashboard": showDashboard,
  "#/dashboard/events": showCourses, // Listado de cursos
  "#/dashboard/events/create": showCreateCourse,
   // Formulario para crear curso
  // You can add more routes if you need other views (for example: profile, settings, etc.)
};


// 📦 Función principal del enrutador SPA
export function router() {
  const path = location.hash || "#/login"; // Toma el hash actual (#/ruta) o redirige a login por defecto
  const user = auth.getUser(); // Obtiene el usuario actual desde localStorage o null

  // 🔐 Protección de rutas: bloquea acceso a dashboard si no está logueado
  if (path.startsWith("#/dashboard") && !auth.isAuthenticated()) {
    location.hash = "#/login"; // redirige al login
    return;
  }

  // 🚫 Evita que usuarios logueados entren a login o register
  if ((path === "#/login" || path === "#/register") && auth.isAuthenticated()) {
    location.hash = "#/dashboard"; // si ya está autenticado, lo manda al dashboard
    return;
  }

  // Ejemplo: ruta dinámica para editar curso
  if (path.startsWith("#/dashboard/courses/edit/")) {
    showEditCourse(); // Implementa esta función en views.js
    return;
  }

  // 🧭 Navegación: encuentra la vista en las rutas y la ejecuta
  const view = routes[path];
  if (view) {
    view(); // carga la vista correspondiente
  } else {
    renderNotFound(); // si no existe, carga vista 404
  }
}