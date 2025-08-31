const ArtContainer = document.getElementById("ArtContainer");
const ArtCardTemplate = document.getElementById("ArtCardTemplate");

const render_arts = ([art, ...artworks]) => {
	if (!art) {
		return;
	}

	const card = ArtCardTemplate.content.cloneNode(true);
	card.querySelector(".art-image").src = art.image_url;
	card.querySelector(".art-image").alt = art.title;
	card.querySelector(".art-title").textContent = art.title;
	card.querySelector(".art-artist").textContent = art.artist;
	card.querySelector(".art-year").textContent = art.year;
	card.querySelector(".art-medium").textContent = art.medium;
	ArtContainer.appendChild(card);

	render_arts(artworks);
};

document.addEventListener("DOMContentLoaded", () => {
	render_arts([
		{
			title: "The Starry Night",
			artist: "Vincent van Gogh",
			year: "1889",
			medium: "Oil on canvas",
			image_url:
				"https://www.artble.com/imgs/e/d/4/45975/starry_night.jpg",
		},
		{
			title: "The Persistence of Memory",
			artist: "Salvador Dalí",
			year: "1931",
			medium: "Oil on canvas",
			image_url:
				"https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg",
		},
		{
			title: "Girl with a Pearl Earring",
			artist: "Johannes Vermeer",
			year: "1665",
			medium: "Oil on canvas",
			image_url:
				"https://upload.wikimedia.org/wikipedia/commons/d/d7/Meisje_met_de_parel.jpg",
		},
		{
			title: "Ophelia",
			artist: "Sir John Everett Millais",
			year: "1851",
			medium: "Oil on canvas",
			image_url:
				"https://eclecticlight.co/wp-content/uploads/2019/07/millaisopheliad1.jpg",
		},
	]);

	const SearchContainer = document.querySelector(".search-container");
	const SearchButton = document.getElementById("SearchButton");
	const SearchInput = document.getElementById("SearchInput");

	SearchButton.addEventListener("click", () => {
		SearchContainer.classList.toggle("active");
		if (SearchContainer.classList.contains("active")) {
			SearchInput.focus();
		}
	});

	const SearchForm = document.getElementById("SearchForm");
	SearchForm.addEventListener("submit", (ev) => {
		ev.preventDefault();
		if (!SearchInput.value) {
			return;
		}

		const query = encodeURIComponent(SearchInput.value);
		window.location.href = `catalog.html?q=${query}`;
	});
});
