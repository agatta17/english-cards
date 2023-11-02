const apiUrl = "https://english-cards-q23m.onrender.com/";
// const apiUrl = "http://localhost/";

export default async function apiFetch(route, method = "GET", request) {
  try {
    const requestOptions = {
      method,
      body: request ? JSON.stringify(request) : null,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const apikey = localStorage.getItem("apikey");
    if (apikey) requestOptions.headers.Authorization = apikey;

    const response = await fetch(`${apiUrl}${route}`, requestOptions);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    } else {
      return data;
    }
  } catch (e) {
    throw new Error(e);
  }
}
