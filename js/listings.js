
const PHONE_NUMBER = "9050501099";

const PUBLISHED_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3K7yILWEa3HU9Bb9xwGkKU_1LFlpg7wztm4lEAYYyMyZNj2_-gtpK3kOJebDjKgS54NaGtgeyRNN5/pub?output=csv";

/* ================= CSV → JSON ================= */
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

/* ================= RENDER ================= */
function renderCards(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  if (!data.length) {
    container.innerHTML = "<p>No available listings.</p>";
    return;
  }

  data.forEach(item => {
    container.innerHTML += `
      <div class="property-card">
        <h3>${item.title}</h3>
        <p>${item.location} • ${item.size}</p>
        ${item.highlight ? `<p>${item.highlight}</p>` : ""}
      </div>
    `;
  });
}

/* ================= LOAD DATA ================= */
window.loadTabData = function (tab) {
  fetch(PUBLISHED_CSV_URL + "&v=" + Date.now())
    .then(r => r.text())
    .then(csv => {
      const data = csvToJson(csv);

      let filtered = [];

      if (tab === "prime") {
        filtered = data.filter(
          item =>
            item.property_status === "Available" &&
            item.featured === "yes"
        );
        renderCards(filtered, "primeDealsContainer");
      }

      if (tab === "buy") {
        filtered = data.filter(
          item =>
            item.property_status === "Available" &&
            item.deal_for === "Buy Property"
        );
        renderCards(filtered, "buyPropertyContainer");
      }

      if (tab === "rent") {
        filtered = data.filter(
          item =>
            item.property_status === "Available" &&
            item.deal_for === "Rent / Lease"
        );
        renderCards(filtered, "rentLeaseContainer");
      }
    })
    .catch(err => {
      console.error("Sheet fetch error:", err);
    });
};

function showTab(tab, el) {
  // Remove active state from buttons
  document.querySelectorAll(".tab-btn")
    .forEach(btn => btn.classList.remove("active"));

  if (el) el.classList.add("active");

  // Hide all sections
  document.querySelectorAll(".property-section")
    .forEach(sec => sec.style.display = "none");

  // Show selected section
  if (tab === "prime") {
    document.getElementById("primeDealsContainer").style.display = "grid";
  }
  if (tab === "buy") {
    document.getElementById("buyPropertyContainer").style.display = "grid";
  }
  if (tab === "rent") {
    document.getElementById("rentLeaseContainer").style.display = "grid";
  }

  // Load data ONLY after click
  loadTabData(tab);
}
