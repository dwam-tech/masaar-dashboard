const API_BASE_URL = "http://192.168.1.8:8000/api";

function buildUrl(path) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return API_BASE_URL.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}

async function apiGet(path) {
  const res = await fetch(buildUrl(path));
  return res.json();
}

async function apiPost(path, data) {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
