import { collection } from "./collection.js";

const ArtContainer = document.getElementById("ArtContainer");
const ArtCardTemplate = document.getElementById("ArtCardTemplate");

document.addEventListener("DOMContentLoaded", async () => {
	const SearchInput = document.getElementById("SearchInput");

	const params = new URLSearchParams(window.location.search);
	const query = params.get("q");
	if (query) {
		search_arts(query);
	} else {
		const storage = collection.request_storage();
		const fill_storage = () => {
			if (storage.length === 0) {
				query_gallery("vincent van gogh").then((query) => {
					query.map(async (id) => {
						const art = await collection.request_image(id);
						if (art) {
							collection.store_art(art);
						}
					});
				});

				fill_storage();
			}
		};

		reload_arts(storage);
	}

	const SearchForm = document.getElementById("SearchForm");
	SearchForm.addEventListener("submit", (ev) => {
		ev.preventDefault();
		if (!SearchInput.value) {
			return;
		}

		const query = encodeURIComponent(SearchInput.value);
		search_arts(query);
	});

	document.getElementById("AddArtButton").addEventListener("click", () => {
		const id = prompt("unique id:");
		const title = prompt("art title:");
		const artist = prompt("artist name:");
		const year = prompt("year:");
		const medium = prompt("medium:");
		const desc = prompt("description:");
		const image_url = prompt("image url:");

		if (!id || !title || !artist || !image_url) {
			return;
		}

		if (find_art_by_id(id)) {
			alert(`Art with ID ${id} already exists`);
			return;
		}

		const art = collection.update_art(
			id,
			year,
			artist,
			title,
			medium,
			desc,
			image_url,
		);

		collection.store_art(art);
		reload_arts(collection.request_storage());
	});
});

const search_arts = async (query) => {
	const gallery = await collection.query_gallery(query);
	const arts = await Promise.all(
		gallery.map((id) => collection.request_image(id)),
	);

	arts.map((art) => {
		collection.store_art(art);
	});

	reload_arts(arts);
};

const reload_arts = (arts) => {
	ArtContainer.innerHTML = "";
	render_arts(arts);
};

const render_arts = ([art, ...artworks]) => {
	if (!art) {
		return;
	}

	const card = ArtCardTemplate.content.cloneNode(true);

	card.querySelector(".art-card").dataset.objectid = art.id;

	card.querySelector(".art-image").src = art.image_url;
	card.querySelector(".art-image").alt = art.title;
	card.querySelector(".art-title").textContent = art.title;
	card.querySelector(".art-artist").textContent = art.artist;
	card.querySelector(".art-year").textContent = art.year;
	card.querySelector(".art-medium").textContent = art.medium;

	const card_buttons = card.querySelector(".art-action-buttons");
	card.querySelector(".art-more-button").addEventListener("click", () => {
		card_buttons.style.display =
			card_buttons.style.display === "flex" ? "none" : "flex";
	});
	card.querySelector(".art-action-edit").addEventListener("click", () =>
		edit_art(art.id),
	);
	card.querySelector(".art-action-delete").addEventListener("click", () =>
		delete_art(art.id),
	);

	ArtContainer.appendChild(card);

	render_arts(artworks);
};

const edit_art = (id) => {
	const card = document.querySelector(`.art-card[data-objectid="${id}"]`);
	if (!card) {
		return;
	}

	if (!collection.find_art_by_id(id)) {
		return;
	}

	const title = prompt("art title:");
	const artist = prompt("artist name:");
	const year = prompt("year:");
	const medium = prompt("medium:");
	const image_url = prompt("image url:");

	if (!title || !artist || !image_url) {
		return;
	}

	const art = collection.update_art(
		id,
		id,
		year,
		artist,
		title,
		medium,
		image_url,
	);

	collection.store_art(art);
	reload_arts(collection.request_storage());
};

const delete_art = (id) => {
	const card = document.querySelector(`.art-card[data-objectid="${id}"]`);
	if (!card) {
		return;
	}

	collection.delete_art(id);
	reload_arts(collection.request_storage());
};
