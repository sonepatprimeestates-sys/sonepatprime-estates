/* ================================
   CONFIG
================================ */
const SHEET_ID = "1uvSZpQBcUXyQbjaMK7UsWOBJkiRvwAVIt8YIYCmXTTA";
const PHONE_NUMBER = "9050501099";

/* ================================
   SHEET URL BUILDER
================================ */
function getSheetUrl(gid) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}&v=${Date.now()}`;
}

/* ================================
   CSV → JSON (COMMA + BOM SAFE)
================================ */
function csvToJson(csv) {
  const rows = csv
    .trim()
    .split("\n")
    .map(row =>
      row
        .match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
        ?.map(cell => cell.replace(/^"|"$/g, "").trim())
    );

  // remove BOM if present
  const headers = rows[0].map(h => h.replace(/^\uFEFF/, ""));

  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] || "";
    });
    return obj;
  });
}

/* ================================
   RENDER CARDS (FAIL-SAFE)
================================ */
function renderCards(data, containerId, showRent = false) {
  let container = document.getElementById(containerId);

  // 🔥 FINAL SAFETY NET:
  // auto-create container if missing
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }

  container.innerHTML = "";

  data
    .filter(item => item.property_status === "Available")
    .forEach(item => {
      container.innerHTML += `
        <div class="property-card">
          <h3>${item.title}</h3>
          <p>${item.location} • ${item.size}</p>

          ${showRent && item.rent ? `<p><strong>${item.rent}</strong></p>` : ""}
          ${item.highlight ? `<p>${item.highlight}</p>` : ""}

          <div class="actions">
            <a href="tel:${PHONE_NUMBER}">📞 Call Now</a>
            <a href="https://wa.me/91${PHONE_NUMBER}?text=Hi,%20I%20am%20interested%20in%20${encodeURIComponent(item.title)}">
              💬 WhatsApp
            </a>
          </div>
        </div>
      `;
    });
}

/* ================================
   FETCH DATA AFTER DOM LOAD
================================ */
document.addEventListener("DOMContentLoaded", () => {

  // Prime Deals
  fetch(getSheetUrl(0))
    .then(res => res.text())
    .then(csv => renderCards(csvToJson(csv), "primeDealsContainer"))
    .catch(err => console.error("Prime Deals error:", err));

  // Buy Property
  fetch(getSheetUrl(426802063))
    .then(res => res.text())
    .then(csv => renderCards(csvToJson(csv), "buyPropertyContainer"))
    .catch(err => console.error("Buy Property error:", err));

  // Rent / Lease
  fetch(getSheetUrl(402021334))
    .then(res => res.text())
    .then(csv => renderCards(csvToJson(csv), "rentLeaseContainer", true))
    .catch(err => console.error("Rent / Lease error:", err));

});
