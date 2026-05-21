import Swal from "sweetalert2";

// URL base de la API
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Configuración personalizada para SweetAlert2
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
  customClass: {
    popup: "rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-4",
    title: "font-outfit text-sm font-bold text-slate-800 dark:text-white",
    htmlContainer: "font-inter text-xs text-slate-500 dark:text-slate-400",
  }
});

// Función para obtener mensajes descriptivos
function getSuccessMessage(method, endpoint) {
  const cleanEndpoint = endpoint.toLowerCase();
  
  if (method === "POST") {
    if (cleanEndpoint.includes("/tasks")) return "Task created successfully.";
    if (cleanEndpoint.includes("/expenses")) return "Expense recorded successfully.";
    if (cleanEndpoint.includes("/houses")) return "House created successfully.";
    if (cleanEndpoint.includes("/house-members") || cleanEndpoint.includes("/members")) return "Member added successfully.";
    return "Record created successfully.";
  }
  
  if (method === "PUT" || method === "PATCH") {
    if (cleanEndpoint.includes("/tasks")) return "Task updated successfully.";
    if (cleanEndpoint.includes("/expenses")) return "Expense updated successfully.";
    if (cleanEndpoint.includes("/houses")) return "House modified successfully.";
    return "Changes saved successfully.";
  }
  
  if (method === "DELETE") {
    if (cleanEndpoint.includes("/tasks")) return "Task deleted successfully.";
    if (cleanEndpoint.includes("/expenses")) return "Expense deleted successfully.";
    if (cleanEndpoint.includes("/houses")) return "House deleted successfully.";
    if (cleanEndpoint.includes("/house-members") || cleanEndpoint.includes("/members")) return "Member removed successfully.";
    return "Record deleted successfully.";
  }
  
  return "Operation completed successfully.";
}

// Función para mostrar confirmaciones
export async function confirmAction({
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  icon = "warning",
  confirmButtonText = "Yes, do it",
  cancelButtonText = "No, cancel"
} = {}) {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    customClass: {
      popup: "rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-6 max-w-sm sm:max-w-md",
      title: "font-outfit text-xl font-bold text-slate-800 dark:text-white",
      htmlContainer: "font-inter text-sm text-slate-500 dark:text-slate-400 my-4",
      confirmButton: "mx-2 rounded-2xl px-6 py-3 font-bold text-white shadow-lg active:scale-95 transition-all cursor-pointer bg-brand-teal hover:bg-brand-teal/90 outline-none",
      cancelButton: "mx-2 rounded-2xl px-6 py-3 font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95 transition-all cursor-pointer outline-none"
    },
    buttonsStyling: false
  });
  
  return result.isConfirmed;
}

// Función para mostrar alertas de error o informativas
export async function showAlert(optionsOrMessage) {
  let config = {
    title: "Notification",
    text: "",
    icon: "info",
    confirmButtonText: "OK"
  };

  if (typeof optionsOrMessage === "string") {
    config.text = optionsOrMessage;
  } else if (typeof optionsOrMessage === "object" && optionsOrMessage !== null) {
    config = { ...config, ...optionsOrMessage };
  }

  await Swal.fire({
    title: config.title,
    text: config.text,
    icon: config.icon,
    confirmButtonText: config.confirmButtonText,
    customClass: {
      popup: "rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-6 max-w-sm sm:max-w-md",
      title: "font-outfit text-xl font-bold text-slate-800 dark:text-white",
      htmlContainer: "font-inter text-sm text-slate-500 dark:text-slate-400 my-4",
      confirmButton: "mx-2 rounded-2xl px-6 py-3 font-bold text-white shadow-lg active:scale-95 transition-all cursor-pointer bg-brand-teal hover:bg-brand-teal/90 outline-none",
    },
    buttonsStyling: false
  });
}


// Crear una función genérica para hacer peticiones HTTP
async function request(endpoint, { method = "GET", body = null, auth = false } = {}) {

  const headers = {
    "Content-Type": "application/json",
  };

  // Si la ruta requiere autenticación (auth = true),
  // leemos el token guardado en localStorage y lo añadimos
  // a la cabecera Authorization
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  // Hacer la petición
  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, options);
  } catch (error) {
    // Si la petición falla por completo
    Toast.fire({
      icon: "error",
      title: "Connection Error",
      text: "Unable to connect to the server. Please check your internet connection.",
      iconColor: "#EF4444",
    });
    throw error;
  }

  const data = await response.json();

  if (!response.ok) {
    if (data.errors && Array.isArray(data.errors)) {
      const errorMessages = data.errors.map(err => err.message).join(', ');
      throw new Error(`${data.message}: ${errorMessages}`);
    }
    throw new Error(data.message || "Error en la petición");
  }

  // Confirmar el éxito de operaciones (excluyendo inicio de sesión y registro)
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())) {
    const cleanEndpoint = endpoint.toLowerCase();
    const shouldSkipAlert = cleanEndpoint.includes("/auth/login") || cleanEndpoint.includes("/auth/register");

    if (!shouldSkipAlert) {
      Toast.fire({
        icon: "success",
        title: getSuccessMessage(method, endpoint),
        iconColor: "#0097A7",
      });
    }
  }

  return data;
}

export default request;


