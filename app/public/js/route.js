/* Instructions: Implement the routing and view logic by importing the necessary functions from views.js and auth.js.
You can add, modify, or remove routes as needed for your application.*/


// 🔁 Import authentication functions and views
import { auth } from "./auth.js"; //Session management (login, logout, current user)
import {
  renderNotFound, // Vista 404 si no encuentra la ruta
} from "./view.js";

// 📌 Define the valid routes for your SPA application here
// Each key is a hash (#/route) and its value is a function that renders that view.

const routes = {
  // You can add more routes if you need other views (for example: profile, settings, etc.)
};


export function router () {
  const path = location.hash || "#login"; // Take the current hash (#/path) or redirect to default login
  const user = auth.getUser(); // Get the current user from localStorage or null

  // 🔐 Route protection: blocks access to the dashboard if you are not logged in
  if (path.startsWith("#/dashboard") && !auth.isAuthenticated()) {
    location.hash = "#/login"; // redirige al login
    return;
  }

  // 🚫 Prevents logged-in users from logging in or registering
  if ((path === "#/login" || path === "#/register") && auth.isAuthenticated()) {
    location.hash = "#/dashboard"; // if already authenticated, sends them to the dashboard
    return;
  }

  // 🧭 Navigation: finds the view in the routes and executes it
  const view = routes[path];
  if (view) {
    view(); // carga la vista correspondiente
  } else {
    renderNotFound(); // si no existe, carga vista 404
  }
}