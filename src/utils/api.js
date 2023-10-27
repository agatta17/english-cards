const apiUrl = "https://english-cards-q23m.onrender.com/";
// const apiUrl = "http://localhost/";

export default async function apiFetch(route, method = "GET", request) {
  try {
    const response = await fetch(`${apiUrl}${route}`, {
      method,
      body: request ? JSON.stringify(request) : null,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (e) {
    throw new Error(e);
  }
}
