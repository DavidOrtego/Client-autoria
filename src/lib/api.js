
// URL base de la API
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
}

export default request;
