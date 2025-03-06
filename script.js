let isNewestFirst = true;
let items = []; // Declare items globally

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://mocki.io/v1/2d7ef5c9-925a-4cdb-a74e-d52459bd3e2d") // Replace with your JSON file or API endpoint
    .then((response) => response.json())
    .then((data) => {
      items = data; // Populate the global items array
      renderItems(items); // Initial render

      // Set up the search event listener after the data is fetched
      const searchInput = document.querySelector("[data-search]");

      searchInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();

        items.forEach((item) => {
          const isVisible =
            item.header.toLowerCase().includes(value) ||
            item.date.toLowerCase().includes(value) ||
            item.description.toLowerCase().includes(value);

          // Toggle the "hide" class based on visibility
          item.element.classList.toggle("hide", !isVisible);
        });
      });
    });

  const searchInput = document.querySelector("[data-search]");
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