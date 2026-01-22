alert("JS LOADED");

const SHEET_ID = "1uvSZpQBcUXyQbjaMK7UsWOBJkiRvwAVIt8YIYCmXTTA";
const PHONE_NUMBER = "9050501099";

/* Published CSV link */
const PUBLISHED_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3K7yILWEa3HU9Bb9xwGkKU_1LFlpg7wztm4lEAYYyMyZNj2_-gtpK3kOJebDjKgS54NaGtgeyRNN5/pub?output=csv";

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
  fetch(PUBLISHED_CSV_URL + "&v=" + Date.now())
    .then(r => r.text())
    .then(csv => {
      const allData = csvToJson(csv);

      let filtered = [];

      if (id === "prime") {
        filtered = allData.filter(
          item =>
            item.property_status === "Available" &&
            item.deal_for === "Prime Deals"
        );
        renderCards(filtered, "primeDealsContainer");
      }

      if (id === "buy") {
        filtered = allData.filter(
          item =>
            item.property_status === "Available" &&
            item.deal_for === "Buy Property"
        );
        renderCards(filtered, "buyPropertyContainer");
      }

      if (id === "rent") {
        filtered = allData.filter(
          item =>
            item.property_status === "Available" &&
            item.deal_for === "Rent / Lease"
        );
        renderCards(filtered, "rentLeaseContainer");
      }
    });
};
