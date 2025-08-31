import { collection } from "./collection.js";

const SearchSubcontainer = document.getElementById("SearchSubcontainer");
const SearchInput = document.getElementById("SearchInput");
const SearchButton = document.getElementById("SearchButton");

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
