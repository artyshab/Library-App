const input = document.getElementById("input-Field");
const btn = document.getElementById("search-btn");
const output = document.getElementById("output");
const searchType = document.getElementById("search-type");
const loader = document.querySelector(".loader");

const defaultCoverUrl = "./assets/cover-not-found.png";

btn.addEventListener("click", () => {
  const query = input.value;
  const type = searchType.value;

  if (!query || !type) {
    alert("Please enter a search term and select a search type.");
    return;
  }

  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
    query
  )}${type === "book" ? "&title=" : "&author="}${encodeURIComponent(query)}`;

  displayLoading(true);

  axios
    .get(url)
    .then((response) => {
      const data = response.data;
      output.innerHTML = "";

      for (let i = 0; i < 40; i++) {
        const doc = data.docs[i];
        const title = doc.title;
        const author = doc.author_name[0];
        const isbn = doc.isbn[0];
        const coverUrl = `http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;

        output.innerHTML += `
            <div class="book">
                <h2>${title}</h2>
                <p>${author}</p>
                ${isbn ? `<img src="${coverUrl}" alt="${title} Cover">` : ""}
                <br>
            </div>
        `;
      }

      const bookElements = document.querySelectorAll(".book");
      bookElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("show");
        }, index * 100); // Stagger the animations
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    })
    .finally(() => {
      displayLoading(false);
    });
});

function displayLoading(show) {
  if (show) {
    loader.classList.add("display");
}
  else {
  loader.classList.remove("display");
  }
}
