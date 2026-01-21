alert("JS LOADED");

const SHEET_ID = "1uvSZpQBcUXyQbjaMK7UsWOBJkiRvwAVIt8YIYCmXTTA";
const PHONE_NUMBER = "9050501099";

function getSheetUrl(gid) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}&v=${Date.now()}`;
}

function csvToJson(csv) {
  const rows = csv
    .trim()
    .split("\n")
    .map(row =>
      row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
        ?.map(cell => cell.replace(/^"|"$/g, "").trim())
    );

  const headers = rows[0].map(h => h.replace(/^\uFEFF/, ""));

  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => (obj[h] = row[i] || ""));
    return obj;
  });
}

function renderCards(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  data
    .filter(item => item.property_status === "Available")
    .forEach(item => {
      container.innerHTML += `
        <div class="property-card">
          <h3>${item.title}</h3>
          <p>${item.location} • ${item.size}</p>
          ${item.highlight ? `<p>${item.highlight}</p>` : ""}
        </div>
      `;
    });
}

window.loadTabData = function (id) {
  if (id === "prime") {
    fetch(getSheetUrl(0))
      .then(r => r.text())
      .then(csv => renderCards(csvToJson(csv), "primeDealsContainer"));
  }

  if (id === "buy") {
    fetch(getSheetUrl(426802063))
      .then(r => r.text())
      .then(csv => renderCards(csvToJson(csv), "buyPropertyContainer"));
  }

  if (id === "rent") {
    fetch(getSheetUrl(402021334))
      .then(r => r.text())
      .then(csv => renderCards(csvToJson(csv), "rentLeaseContainer"));
  }
};
