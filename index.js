import "./app/public/js/api.js"; // Implementa la API en js/api.js
import "./app/public/js/auth.js"; // Implementa la autenticación en js/auth.js
import { router } from "./app/public/js/route.js"; // Implementa el enrutador en js/router.js

// Inicializa el enrutador al cargar la página y al cambiar el hash
window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);

// Puedes agregar aquí lógica global si lo necesitas
