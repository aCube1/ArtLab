import { collection } from "./collection.js";

const SearchSubcontainer = document.getElementById("SearchSubcontainer");
const SearchInput = document.getElementById("SearchInput");
const SearchButton = document.getElementById("SearchButton");

const ArtSlideTemplate = document.getElementById("ArtSlideTemplate");
const ArtContainer = document.getElementById("ArtContainer");

SearchButton.addEventListener("click", () => {
	SearchSubcontainer.classList.add("expanded");
	SearchInput.classList.remove("collapsed");
	SearchInput.focus();
});

SearchInput.addEventListener("blur", () => {
	if (!SearchInput.value) {
		SearchSubcontainer.classList.remove("expanded");
		SearchInput.classList.add("collapsed");
	}
});

const add_art_slider = (art) => {
	if (!art) {
		return null;
	}

	const clone = ArtSlideTemplate.content.cloneNode(true);
	clone
		.querySelector(".art")
		.setAttribute("style", `background-image: url(${art.image_url});`);

	console.log(art.artist);
	console.log(art.desc);

	clone.querySelector(".art-title").textContent = art.title;
	clone.querySelector(".art-artist").textContent = art.artist;
	clone.querySelector(".art-year").textContent = art.year;
	clone.querySelector(".art-desc").textContent = art.desc;
	clone.querySelector(".art-medium").textContent = art.medium;
	clone.querySelector(".art-dimensions").textContent = art.dimensions;

	ArtContainer.appendChild(clone);
};

// Welcome message
collection.get_random_art().then((art) => add_art_slider(art));
