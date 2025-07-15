import { api } from "./api.js";
import { auth } from "./auth.js";
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

// Implementa la vista principal del dashboard
export async function showDashboard() {
  const u = auth.getUser();
  document.getElementById("app").innerHTML = `
   <nav class="dashboard_nav">
   <button id="out">Salir</button>
    ${
      u.role === "cliente"
        ? `<a href="#/dashboard/register/events" data-link>Historial de eventos</a>`
        : ""
    }
      <a href="#/dashboard/events" data-link>Ver eventos</a>
    ${
      u.role === "admin"
        ? `<a href="#/dashboard/events/create" data-link>Crear Eventos</a>`
        : ""
    }
    </nav>
    <div class="container_dashboard">
     <h2>Bienvenido, ${u.name} (${u.role})</h2>
    <button class="salir" id="out">Salir</button>
    </div>`;
  document.getElementById("out").onclick = auth.logout;
  document.querySelectorAll("[data-link]").forEach((a) => {
    a.onclick = (e) => {
      e.preventDefault();
      location.hash = a.getAttribute("href");
    };
  });
}

// Implementa la vista de listado de cursos
export async function showCourses() {
  const user = auth.getUser();
  const events = await api.get("/events");

  document.getElementById("app").innerHTML = `

  
    <nav class="dashboard_nav">
     <button id="out">Salir</button>
      ${
        user.role === "cliente"
          ? `<a href="#/dashboard/register/events" data-link>Event history</a>`
          : ""
      }
      <a href="#/dashboard/events" data-link>View events</a>
    ${
      user.role === "admin"
        ? `<a href="#/dashboard/events/create" data-link>Create Events</a>`
        : ""
    }
    </nav>

    <div class="container_dashboard">
    <h2>available events</h2>
    ${events
      .map(
        (c) => `
         <div class="card__events" style="background-color:${c.color}">

            <h2>${c.title || "Sin título"}</h2>

            <p>(${c.ability || 0} slots) ability</p>
        
            ${
              user.role === "admin"
                ? `<a href="#/dashboard/courses/edit/${c.id}" data-link>edit event</a>
                    <button class="eliminar" onclick="eliminarEmocion('${c.id}')">delete</button>
                `
                : ""
            }
            ${
              user.role === "cliente"
                ? `<button class="enroll-btn" data-id="${c.id,user.id}">Inscribirse</button>`
                : ""
            }
      
        </div>`
      )
      .join("")}</div>`;

  document.getElementById("out").onclick = auth.logout;
  document.querySelectorAll("[data-link]").forEach((a) => {
    a.onclick = (e) => {
      e.preventDefault();
      location.hash = a.getAttribute("href");
    };
  });

  if (user.role === "cliente") {
    document.querySelectorAll(".enroll-btn").forEach((btn) => {
      btn.onclick = async () => {
        debugger;
        const eventId = btn.dataset.id;

        // Obtener curso actual
        const event = await api.get("/events/" + eventId);

        // Simular lista de inscritos (opcional)
        if (!event.enrolled) event.enrolled = [];

        // Evitar doble inscripción
        if (event.enrolled.includes(user.email)) {
          alert("You are already enrolled in this course.");
          return;
        }

        let ability = event.ability - 1;

        // Verificar capacidad
        if (event.enrolled.length >= event.ability) {
          alert("This event is already full.");
          return;
        }

        event.enrolled.push(user.email);
        event.ability = ability;

        debugger;
        const response = await api.put("/events/" + eventId, event);
        if (response && response.id) {
          const data = {
            fecha: new Date(),
            idPersona: user.id,
            idEvento: response.id,
          };
        
          await api.post("/registrations", data);

        }
        alert("Successful registration!");
        showCourses(); // recargar lista
      };
    });
  }

  // 🗑️ Eliminar emoción
  window.eliminarEmocion = async function (id) {
    debugger;
    if (!confirm("¿Delete this event?")) return;
    await api.delete(`/events/${id}`);
    showCourses(); // recarga dashboard
  };
}

// Implementa la vista para crear un curso (solo admin)
export function showCreateCourse() {
  const user = auth.getUser();
  document.getElementById("app").innerHTML = `

    <nav class="dashboard_nav">
         <button id="out">Salir</button>
      ${
        user.role === "cliente"
          ? `<a href="#/dashboard/register/events" data-link>Event history</a>`
          : ""
      }
      <a href="#/dashboard/events" data-link>View events</a>
    ${
      user.role === "admin"
        ? `<a href="#/dashboard/events/create" data-link>Create Events</a>`
        : ""
    }
    </nav>
    <div class="container_dashboard">
    <h2>Create events</h2>
    <form id="f" class="form_create">
      <input placeholder="Título" id="title">
      <input type="color" id="color" value="#FFE066" />
      <input type="number" placeholder="Capacidad" id="ability">
      <button>Guardar</button>
    </form>
     </div>
    `;

  document.getElementById("f").onsubmit = async (e) => {
    e.preventDefault();
    debugger;
    const data = {
      title: e.target.title.value,
      color: e.target.color.value,
      ability: parseInt(e.target.ability.value),
      enrolled: [],
    };


    await api.post("/events", data);

    location.hash = "#/dashboard/events";
    router();
  };

  document.getElementById("out").onclick = auth.logout;
  document.querySelectorAll("[data-link]").forEach((a) => {
    a.onclick = (e) => {
      e.preventDefault();
      location.hash = a.getAttribute("href");
    };
  });
}

// Implementa la vista para editar un curso (solo admin)
export async function showEditCourse() {
  const user = auth.getUser();
  if (user.role !== "admin") {
    renderNotFound();
    return;
  }

  const eventId = location.hash.split("/").pop();
  const event = await api.get("/events/" + eventId);

  if (!event) {
    renderNotFound();
    return;
  }

  document.getElementById("app").innerHTML = `

   <nav class="dashboard_nav">
     <button id="out">Salir</button>
      ${
        user.role === "cliente"
          ? `<a href="#/dashboard/register/events" data-link>Event history</a>`
          : ""
      }
      <a href="#/dashboard/events" data-link>View events</a>
    ${
      user.role === "admin"
        ? `<a href="#/dashboard/events/create" data-link>Create Events</a>`
        : ""
    }
    </nav>
     <div class="container_dashboard">
    <h2>Editar Curso</h2>
    <form id="f" class="form_edit">
      <input id="title" placeholder="Título" value="${event.title}">
      <input type="color" id="color" value="${event.color}" />
      <input type="number" id="ability" placeholder="ability" value="${
        event.ability
      }">
      <button>Guardar</button>
    </form>
    </div>
    `;

  document.getElementById("f").onsubmit = async (e) => {
    e.preventDefault();
    const updated = {
      title: e.target.title.value,
      color: e.target.color.value,
      ability: parseInt(e.target.ability.value),
    };
    await api.put("/events/" + eventId, updated);
    location.hash = "#/dashboard/events";
    router();
  };

  document.getElementById("out").onclick = auth.logout;
  document.querySelectorAll("[data-link]").forEach((a) => {
    a.onclick = (e) => {
      e.preventDefault();
      location.hash = a.getAttribute("href");
    };
  });
}
