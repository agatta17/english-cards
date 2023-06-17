const apiUrl = "https://english-cards-q23m.onrender.com/";

export default async function apiFetch(route, options = null) {
  try {
    const response = await fetch(`${apiUrl}${route}`, options);
    const data = await response.json();
    return data;
  } catch (e) {
    return {
      ok: false,
      error: e,
    };
  }
}
