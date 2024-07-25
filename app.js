const input = document.getElementById("input-Field");
const btn = document.getElementById("search-btn");
const output = document.getElementById("output");
const bookDisplay = document.getElementById("book-display");
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

  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}${type === "book" ? "&title=" : "&author="}${encodeURIComponent(query)}`;

  displayLoading(true);

  axios
    .get(url)
    .then((response) => {
      const data = response.data;
      output.innerHTML = "";
      bookDisplay.innerHTML = "";

      for (let i = 0; i < 40; i++) {
        const doc = data.docs[i];
        const title = doc.title;
        const author = doc.author_name ? doc.author_name[0] : "Unknown Author";
        const isbn = doc.isbn ? doc.isbn[0] : "";
        const coverUrl = isbn ? `http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg` : defaultCoverUrl;

        output.innerHTML += `
          <a href="#container-info" data-index="${i}" class="book-Info">
            <div class="book">
              <h2>${title}</h2>
              <p>${author}</p>
              <img src="${coverUrl}" alt="${title} Cover">
              <br>
            </div>
          </a>
        `;

        console.log(doc);
      }

      const bookLinks = document.querySelectorAll(".book-Info");
      const containerInfo = document.getElementById("container-info");
      bookLinks.forEach(link => {
        link.addEventListener("click", (event) => { 
          const index = event.currentTarget.getAttribute("data-index");
          const doc = data.docs[index];
          const title = doc.title;
          const author = doc.author_name ? doc.author_name[0] : "Unknown Author";
          const isbn = doc.isbn ? doc.isbn[0] : "";
          const coverUrl = isbn ? `http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg` : defaultCoverUrl;
          const published = doc.first_publish_year;
          const publisher = doc.publisher ? doc.publisher[0] : "" ;

          bookDisplay.innerHTML = `
            
              <h2>${title}</h2>
              <p>${author}</p>
              <img src="${coverUrl}" alt="${title} Cover" id="bookDisplay-img">
              <p id="published-paragraph">Published : ${published}</p>
              <p id="published-paragraph">Publisher : ${publisher}</p>
              <br>
              
          `;
             
          containerInfo.style.display = "block";

        });
      });

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
  } else {
    loader.classList.remove("display");
  }
}
