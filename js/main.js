const DATA_URL = "data/materials.json";
const grid = document.getElementById("materialGrid");
const searchInput = document.getElementById("search");
const filtersEl = document.getElementById("filters");
const resultCount = document.getElementById("resultCount");
const favoritesOnlyBtn = document.getElementById("favoritesOnly");
const compareToggle = document.getElementById("compareToggle");
const compareBar = document.getElementById("compareBar");
const compareText = document.getElementById("compareText");
let materials = [];
let activeCategory = "Toutes";
let favoritesOnly = false;
let compareIds = [];
let favorites = new Set(JSON.parse(localStorage.getItem("mdb-favorites") || "[]"));

const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const saveFavorites = () => localStorage.setItem("mdb-favorites", JSON.stringify([...favorites]));
const saveCompare = () => {
  compareToggle.textContent = `⇄ Comparer (${compareIds.length})`;
  compareBar.hidden = compareIds.length === 0;
  compareText.textContent = compareIds.length ? `${compareIds.length} matériau(x) sélectionné(s) — maximum 3.` : "Sélectionnez jusqu'à 3 matériaux.";
};

function renderFilters() {
  const categories = ["Toutes", ...new Set(materials.map(m => m.category))];
  filtersEl.innerHTML = categories.map(cat => `<button class="filter-btn ${cat === activeCategory ? "active" : ""}" data-category="${esc(cat)}" type="button">${esc(cat)}</button>`).join("");
  filtersEl.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
    activeCategory = btn.dataset.category;
    renderFilters();
    renderCards();
  }));
}

function cardTemplate(m, index) {
  const saved = favorites.has(m.id);
  const selected = compareIds.includes(m.id);
  return `<article class="material-card">
    <div class="card-images">
      <img src="${esc(m.texture)}" alt="${esc(m.textureAlt)}" loading="lazy">
      <img src="${esc(m.application)}" alt="${esc(m.applicationAlt)}" loading="lazy">
    </div>
    <div class="card-body">
      <div class="card-top"><span class="category-label">${esc(m.category)}</span><span class="card-index">${String(index+1).padStart(2,"0")}</span></div>
      <h2><a href="material.html?id=${encodeURIComponent(m.id)}">${esc(m.name)}</a></h2>
      <div class="card-subtitle">${esc(m.subtitle)}</div>
      <p class="card-description">${esc(m.description)}</p>
      <div class="card-bottom">
        <span class="density">${esc(m.density)}</span>
        <a class="detail-link" href="material.html?id=${encodeURIComponent(m.id)}">Explorer la fiche ↗</a>
        <button class="fav-btn ${saved ? "saved" : ""}" data-fav="${esc(m.id)}" aria-label="${saved ? "Retirer des favoris" : "Ajouter aux favoris"}" title="Favori">${saved ? "♥" : "♡"}</button>
      </div>
      <div style="padding-top:13px"><button class="utility-btn ${selected ? "active" : ""}" data-compare="${esc(m.id)}" type="button">${selected ? "✓ Sélectionné" : "+ Comparer"}</button></div>
    </div>
  </article>`;
}

function renderCards() {
  const q = searchInput.value.trim().toLocaleLowerCase("fr");
  let list = materials.filter(m => {
    const searchable = [m.name,m.category,m.family,m.subtitle,m.description,...m.properties,...m.uses].join(" ").toLocaleLowerCase("fr");
    return (activeCategory === "Toutes" || m.category === activeCategory)
      && (!q || searchable.includes(q))
      && (!favoritesOnly || favorites.has(m.id));
  });
  const sort = document.getElementById("sort").value;
  if (sort === "name") list.sort((a,b) => a.name.localeCompare(b.name,"fr"));
  if (sort === "category") list.sort((a,b) => a.category.localeCompare(b.category,"fr") || a.name.localeCompare(b.name,"fr"));
  resultCount.textContent = `${list.length} matériau${list.length > 1 ? "x" : ""} référencé${list.length > 1 ? "s" : ""}`;
  grid.innerHTML = list.length ? list.map((m,i) => cardTemplate(m,i)).join("") : `<div class="empty-state">Aucun matériau ne correspond à cette recherche.</div>`;
  grid.querySelectorAll("[data-fav]").forEach(btn => btn.addEventListener("click", () => {
    const id = btn.dataset.fav;
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    saveFavorites(); renderCards();
  }));
  grid.querySelectorAll("[data-compare]").forEach(btn => btn.addEventListener("click", () => {
    const id = btn.dataset.compare;
    if (compareIds.includes(id)) compareIds = compareIds.filter(x => x !== id);
    else if (compareIds.length < 3) compareIds.push(id);
    else { alert("La comparaison est limitée à 3 matériaux."); return; }
    saveCompare(); renderCards();
  }));
}

function showComparison() {
  const selected = materials.filter(m => compareIds.includes(m.id));
  if (!selected.length) return;
  const rows = [
    ["Catégorie",m=>m.category],["Famille",m=>m.family],["Densité",m=>m.density],
    ["Prix indicatif",m=>m.price],["Propriétés",m=>m.properties.join(" · ")],
    ["Applications",m=>m.uses.join(" · ")],["Procédés",m=>m.process.join(" · ")]
  ];
  const html = `<section class="main-wrap"><div class="kicker">Outil de comparaison</div><h1 style="font:normal 48px Georgia;margin:15px 0 30px">Comparer les matières</h1><table class="compare-table"><thead><tr><th>Critère</th>${selected.map(m=>`<th>${esc(m.name)}</th>`).join("")}</tr></thead><tbody>${rows.map(([label,get])=>`<tr><th>${esc(label)}</th>${selected.map(m=>`<td>${esc(get(m))}</td>`).join("")}</tr>`).join("")}</tbody></table><p style="margin-top:25px"><a href="index.html">← Retour à la bibliothèque</a></p></section>`;
  const win = window.open("", "_blank");
  if (!win) { alert("Autorisez les fenêtres contextuelles pour afficher la comparaison."); return; }
  win.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Comparaison — Material Database</title><link rel="stylesheet" href="css/style.css"></head><body>${html}</body></html>`);
  win.document.close();
}

searchInput.addEventListener("input", renderCards);
document.getElementById("sort").addEventListener("change", renderCards);
favoritesOnlyBtn.addEventListener("click", () => {
  favoritesOnly = !favoritesOnly;
  favoritesOnlyBtn.classList.toggle("active", favoritesOnly);
  renderCards();
});
compareToggle.addEventListener("click", () => {
  compareBar.hidden = !compareBar.hidden;
});
document.getElementById("clearCompare").addEventListener("click", () => {
  compareIds = []; saveCompare(); renderCards();
});
document.getElementById("showCompare").addEventListener("click", showComparison);

fetch(DATA_URL).then(r => {
  if (!r.ok) throw new Error("Impossible de charger data/materials.json");
  return r.json();
}).then(data => {
  materials = data;
  renderFilters(); renderCards(); saveCompare();
}).catch(err => {
  grid.innerHTML = `<div class="empty-state">La bibliothèque n'a pas pu charger ses données. Vérifiez que le dossier <strong>data</strong> et le fichier <strong>materials.json</strong> sont bien présents, puis ouvrez le site via GitHub Pages ou un serveur local.</div>`;
  resultCount.textContent = "Erreur de chargement";
  console.error(err);
});