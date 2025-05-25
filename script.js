let isNewestFirst = true;
let items = []; // Declare items globally

document.addEventListener("DOMContentLoaded", function () {
  const primaryURL = "https://shoterz.github.io/stonkentries/testjson.json";
  const fallbackURL = "https://stonkentries.stocksuite.app/testjson.json";
  const searchInput = document.querySelector("[data-search]");

  function fetchJSON(url) {
    return fetch(url).then((response) => {
      const contentType = response.headers.get("Content-Type") || "";
      if (!response.ok || contentType.includes("text/html")) {
        throw new Error("Invalid response or wrong content type");
      }
      return response.json();
    });
  }

  function setupSearch(items) {
    searchInput.addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();
      items.forEach((item) => {
        const isVisible =
          item.header.toLowerCase().includes(value) ||
          item.date.toLowerCase().includes(value) ||
          item.description.toLowerCase().includes(value);

        item.element.classList.toggle("hide", !isVisible);
      });
    });
  }

  // Attempt to fetch from primary, fallback on error
  fetchJSON(primaryURL)
    .catch(() => fetchJSON(fallbackURL))
    .then((data) => {
      items = data;
      renderItems(items); // Your render function populates item.element
      setupSearch(items);
    })
    .catch((error) => {
      console.error("Both fetch attempts failed:", error);
    });

  // Keyboard shortcut handler
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && event.target.tagName !== "INPUT") {
      event.preventDefault();
      searchInput.focus();
    } else if (event.key === "Escape") {
      searchInput.blur();
    }
  });
});


function sortItemsById() {
  isNewestFirst = !isNewestFirst;
  const sortedItems = [...items].sort((a, b) => {
    return isNewestFirst ? b.id - a.id : a.id - b.id;
  });
  renderItems(sortedItems);
}

function renderItems(items) {
  const container = document.getElementById("jLgiM");
  container.innerHTML = ""; // Clear previous content

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "card-tile";
    itemElement.setAttribute("onclick", "toggleDescription(this)"); // Add onclick event

    // Create the inner HTML structure based on your provided HTML
    itemElement.innerHTML = `
      <div class="card-header">${item.header}</div>
      <div class="card-description" data-expanded="false">
        <p style="margin-top: 0px; margin-bottom: 10px;">${item.date}</p>
        ${item.description}
      </div>
    `;

    container.appendChild(itemElement);
    item.element = itemElement; // Store a reference to the DOM element
  });
}

function toggleDescription(cardTile) {
  const description = cardTile.querySelector('.card-description');
  const isExpanded = description.getAttribute('data-expanded') === 'true';

  if (isExpanded) {
    description.classList.remove('expanded');
    description.setAttribute('data-expanded', 'false');
  } else {
    description.classList.add('expanded');
    description.setAttribute('data-expanded', 'true');
  }
}

function toggleTheme() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}
