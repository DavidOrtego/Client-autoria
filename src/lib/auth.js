
import request from "./api";

// Recibe email y password, llama a POST /api/auth/login
// y guarda el token que devuelve el servidor en localStorage.
export async function login(email, password) {

  const response = await request("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }


  return response;
}


// Borra el token guardado en localStorage.
export function logout() {
  localStorage.removeItem("token");
}