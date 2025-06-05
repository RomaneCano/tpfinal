export async function doAjaxRequest(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Erreur lors du chargement");
  return await response.json();
}

export async function doAjaxPost(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error("Erreur lors du POST");
  return await response.json();
}

export async function doAjaxDelete(url) {
  const response = await fetch(url, {
    method: "DELETE"
  });
  if (!response.ok) throw new Error("Erreur DELETE");
}
