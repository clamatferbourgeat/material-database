const params = new URLSearchParams(location.search);
const id = params.get("id");
const root = document.getElementById("detailRoot");
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const list = arr => `<ul class="detail-list">${(arr || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
fetch("data/materials.json").then(r => {
  if (!r.ok) throw new Error("Données indisponibles");
  return r.json();
}).then(materials => {
  const m = materials.find(item => item.id === id);
  if (!m) {
    root.innerHTML = `<main class="main-wrap"><p>Cette fiche matériau est introuvable.</p><a href="index.html">← Retour à la bibliothèque</a></main>`;
    return;
  }
  document.title = `${m.name} — Material Database`;
  root.innerHTML = `
  <section class="detail-hero">
    <a class="breadcrumb" href="index.html">← Bibliothèque / ${esc(m.category)}</a>
    <div class="detail-title-row">
      <div><div class="eyebrow">${esc(m.category)} / ${esc(m.family)}</div><h1>${esc(m.name)}</h1><p>${esc(m.subtitle)} — ${esc(m.description)}</p></div>
      <span class="detail-number">Material no. ${String(materials.indexOf(m)+1).padStart(3,"0")}</span>
    </div>
  </section>
  <section class="detail-gallery">
    <figure><img src="${esc(m.texture)}" alt="${esc(m.textureAlt)}"><figcaption>01 — Texture & matière</figcaption></figure>
    <figure><img src="${esc(m.application)}" alt="${esc(m.applicationAlt)}"><figcaption>02 — Application & usage</figcaption></figure>
  </section>
  <main class="detail-content">
    <div>
      <section class="detail-section"><div class="eyebrow">01 / Description</div><h2>La matière</h2><p>${esc(m.description)}</p></section>
      <section class="detail-section"><div class="eyebrow">02 / Comportement</div><h2>Propriétés</h2>${list(m.properties)}</section>
      <section class="detail-section"><div class="eyebrow">03 / Évaluation</div><h2>Atouts</h2>${list(m.pros)}</section>
      <section class="detail-section"><div class="eyebrow">04 / Limites</div><h2>Points de vigilance</h2>${list(m.cons)}</section>
      <section class="detail-section"><div class="eyebrow">05 / Usages</div><h2>Applications</h2>${list(m.uses)}</section>
      <section class="detail-section"><div class="eyebrow">06 / Fabrication</div><h2>Procédés de transformation</h2><div class="tag-list">${m.process.map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</div></section>
    </div>
    <aside class="spec-panel">
      <div class="eyebrow">Données essentielles</div><h2>Fiche technique</h2>
      <div class="spec-row"><span class="spec-label">Famille</span><div class="spec-value">${esc(m.family)}</div></div>
      <div class="spec-row"><span class="spec-label">Densité / masse volumique</span><div class="spec-value">${esc(m.density)}</div></div>
      <div class="spec-row"><span class="spec-label">Prix indicatif</span><div class="spec-value">${esc(m.price)}</div></div>
      <p class="spec-note">${esc(m.priceNote)} Les valeurs sont indicatives et doivent être vérifiées auprès des fournisseurs et des fiches techniques du grade choisi.</p>
    </aside>
  </main>`;
}).catch(err => {
  root.innerHTML = `<main class="main-wrap"><p>Impossible de charger la fiche. Vérifiez la présence du fichier <code>data/materials.json</code>.</p><a href="index.html">← Retour</a></main>`;
  console.error(err);
});