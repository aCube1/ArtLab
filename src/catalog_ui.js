import { collection } from "./collection.js";

const ArtContainer = document.getElementById("ArtContainer");
const ArtCardTemplate = document.getElementById("ArtCardTemplate");

const fill_storage = async () => {
	const storage = collection.request_storage("cache");
	if (storage.length !== 0) {
		return;
	}

	const gallery = await collection.query_gallery("oil");
	const arts = await Promise.all(
		gallery.map((id) => collection.request_image(id, "cache")),
	);

	await Promise.all(
		arts
			.filter((art) => art) //
			.map((art) => collection.cache_art(art)),
	);
};

const merge_storage = () => [
	...collection.request_storage("user"),
	...collection.request_storage("cache"),
];

document.addEventListener("DOMContentLoaded", async () => {
	const SearchInput = document.getElementById("SearchInput");

	const params = new URLSearchParams(window.location.search);
	const query = params.get("q");
	if (query) {
		search_arts(query);
	} else {
		await fill_storage();
		reload_arts(merge_storage());
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
		const id = prompt("Unique ID:");
		const title = prompt("Art Title:");
		const artist = prompt("Artist Name:");
		const year = prompt("Year:");
		const medium = prompt("Medium:");
		const image_url = prompt("Image URL:");

		if (!id || !title || !artist || !image_url) {
			return;
		}

		if (collection.find_art_by_id(id)) {
			alert(`Art with ID ${id} already exists`);
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

		collection.store_user_art(art);
		reload_arts(merge_storage());
	});
});

const search_storage = (query, type) => {
	const storage = collection.request_storage(type);
	const queries = decodeURIComponent(query).split(" ");

	const lower_queries = queries.map((q) => q.toLowerCase());

	return storage
		.map((art) => {
			const score = lower_queries.reduce((acc, q) => {
				const haystack = [art.title, art.artist, art.desc]
					.join(" ")
					.toLowerCase();
				return acc + (haystack.includes(q) ? 1 : 0);
			}, 0);

			return { art, score };
		})
		.filter((obj) => obj.score > 0)
		.map((obj) => obj.art);
};

const search_arts = async (query) => {
	const user_storage = search_storage(query, "user");

	const gallery = await collection.query_gallery(query);
	const arts = await Promise.all(
		gallery.map((id) => collection.request_image(id, "cache")),
	);

	if (arts) {
		arts.map((art) => {
			collection.cache_art(art);
		});

		reload_arts([...user_storage, ...arts]);
	} else {
		const cache_storage = search_storage(query, "cache");
		reload_arts([...user_storage, ...cache_storage]);
	}
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

	collection.store_user_art(art);
	reload_arts(merge_storage());
};

const delete_art = (id) => {
	const card = document.querySelector(`.art-card[data-objectid="${id}"]`);
	if (!card) {
		return;
	}

	collection.delete_art(id);
	reload_arts(merge_storage());
};
