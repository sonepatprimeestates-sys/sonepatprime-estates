const BASE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3K7yILWEa3HU9Bb9xwGkKU_1LFlpg7wztm4lEAYYyMyZNj2_-gtpK3kOJebDjKgS54NaGtgeyRNN5/pub?output=csv";

const PHONE_NUMBER = "9050501099"; // your number

// CSV → JSON
function csvToJson(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(",");
    let obj = {};
    headers.forEach((h, i) => (obj[h] = values[i]?.trim()));
    return obj;
  });
}

// Render cards (ONLY Available shown)
function renderCards(data, containerId, showRent = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  data
    .filter(item => item.status === "Available") // ✅ WEBSITE RULE
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

// Prime Deals
fetch(`${BASE_SHEET_URL}&gid=0`)
  .then(res => res.text())
  .then(csv => renderCards(csvToJson(csv), "primeDealsContainer"));

// Buy Property
fetch(`${BASE_SHEET_URL}&gid=426802063`)
  .then(res => res.text())
  .then(csv => renderCards(csvToJson(csv), "buyPropertyContainer"));

// Rent / Lease
fetch(`${BASE_SHEET_URL}&gid=402021334`)
  .then(res => res.text())
  .then(csv => renderCards(csvToJson(csv), "rentLeaseContainer", true));
