/**
 * @typedef ArtObject
 * @type {object}
 * @property {number} id - Unique ID
 * @property {string} title - Title given by artist
 * @property {number} year - Release year
 * @property {string} artist - Artist's display name
 * @property {string} medium - Materials that were used to create the artwork
 * @property {string} image_url - URL to the image
 * @property {string} full_image_url - URL to the full image
 * @property {Array<URL>} additional_image_urls - Additional images URLs
 */

// Used to bypass CORS validation
const CORS_PROXY = "https://corsproxy.io/?";

const METMUSEUM_URL =
	CORS_PROXY + "https://collectionapi.metmuseum.org/public/collection/v1/";

const STORAGE_KEY = "artslab::gallery";

/**
 * Search images in the MetMuseum database
 *
 * @param {string} query - String of terms
 * @return {Promise<array>} List of IDs for each image that matches the query
 */
const query_gallery = async (query) => {
	if (!query) {
		return [];
	}

	// URL composition:
	// ?hasImages=true
	// &q=query
	const url = METMUSEUM_URL + `search?q=${query}&hasImages=true`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`${response.status} -> ${response.statusText}`);
		}

		const result = await response.json();
		console.debug(`Total objects fetched: ${result.total}`);

		return result.objectIDs || [];
	} catch (err) {
		console.error(`Failed to fetch data from '${url}': ${err.message}`);
		return [];
	}
};

/**
 * Return storage list
 *
 * @return {Array<ArtObject>} Art list
 */
const request_storage = (type) => {
	const storage_key = STORAGE_KEY + (type == "user" ? "::user" : "::cache");
	const storage = localStorage.getItem(storage_key);
	if (!storage) {
		return [];
	}

	try {
		const data = JSON.parse(storage);
		if (!(data instanceof Array)) {
			throw new Error();
		}

		return data;
	} catch (_) {
		console.error(`Invalid json data in Storage key: '${STORAGE_KEY}'`);
		return [];
	}
};

/**
 * Request image from MetMuseum using it's ID. Return stored object if
 * it already exists inside localStorage
 *
 * @param {number} id - MetMuseum valid ID
 * @return {Promise<(ArtObject|null)>} Image metadata
 */
const request_image = async (id, type) => {
	// Firstly, check if ID is already in localStorage
	const storage_data = request_storage(type);
	const matches = storage_data.filter((img) => img.id === id);
	if (matches.length > 0 && matches[0]) {
		return matches[0];
	}

	const url = METMUSEUM_URL + `objects/${id}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`${response.status} -> ${response.statusText}`);
		}

		const result = await response.json();
		if (!result) {
			throw new Error("Invalid");
		}

		const art_metadata = {
			id: result.objectID,
			title: result.title,
			artist: result.artistDisplayName,
			year: result.accessionYear,
			medium: result.medium,
			image_url: result.primaryImageSmall,
			full_image_url: result.primaryImage,
			additional_image_urls: result.additionalImages,
		};

		// Cache art in localStorage for future requests
		return art_metadata;
	} catch (err) {
		console.error(`Failed to fetch data from '${url}': ${err.message}`);
		return null;
	}
};

/**
 * Get random art from gallery.
 *
 * @return {Promise<ArtObject>} Random art object
 */
const get_random_art = () => {
	const storage_data = request_storage();
	const random_index = Math.floor(Math.random() * storage_data.length);
	return storage_data[random_index];
};

/**
 * Get art from ID in the gallery
 *
 * @param {number} id - Unique ID
 * @return {ArtObject}
 */
const find_art_by_id = (id, type) => {
	const storage = request_storage(type);
	const matches = storage.filter((img) => img && img.id == id);
	if (matches.length === 0 || !matches[0]) {
		return null;
	}

	return matches[0];
};

/**
 * Clear localStorage memory
 */
const reset_gallery = () => {
	localStorage.removeItem(STORAGE_KEY + "::user");
	localStorage.removeItem(STORAGE_KEY + "::cache");
	console.log("Art gallery cleared!");
};

/**
 * Store art object in localStorage. If art with ID already exists, delete it
 * before storing the new one.
 *
 * @param {ArtObject} art - Art object
 */
const store_user_art = (art) => {
	if (!art) {
		return;
	}
	const storage_key_user = STORAGE_KEY + "::user";

	if (find_art_by_id(art.id, "user")) {
		console.warn(
			`Art with ID ${art.id} already exists! Replacing it... :D`,
		);
		delete_art(art.id);
	}

	const storage = request_storage("user");
	localStorage.setItem(storage_key_user, JSON.stringify([art, ...storage]));
};

const cache_art = (art) => {
	if (!art || find_art_by_id(art.id, "cache")) {
		return;
	}

	const storage_key_cache = STORAGE_KEY + "::cache";
	const storage = request_storage("cache");
	localStorage.setItem(storage_key_cache, JSON.stringify([art, ...storage]));
};

/**
 * Delete art stored in localStorage
 *
 * @param {number} id - Unique ID
 * @return {ArtObject} Gallery list without ID's art
 */
const delete_art = (id) => {
	const storage_key_cache = STORAGE_KEY + "::user";

	const storage_data = request_storage("user");
	const filtered_gallery = storage_data.filter((img) => img && img.id != id);
	localStorage.setItem(storage_key_cache, JSON.stringify(filtered_gallery));

	console.log(`Art with ID ${id} from local gallery was deleted`);
	return filtered_gallery;
};

/**
 * Update art's metadata with user's provided info
 *
 * @param {number} id - Current ID
 * @param {number} new_id - New Unique ID
 * @param {string} artist - Artist's name
 * @param {string} title - Title
 * @param {number} year - Release year
 * @param {string} medium - Materials used to create art
 * @param {URL} image_url - Valid URL to some image
 * @return {ArtObject} Updated list with new metadata
 */
const update_art = (id, new_id, year, artist, title, medium, image_url) => {
	const art = find_art_by_id(id, "user") ?? {};

	return {
		...art,
		id: new_id,
		year: year,
		artist: artist,
		title: title,
		medium: medium,
		image_url: image_url,
	};
};
export const collection = {
	// MetMuseum database reading
	query_gallery,
	request_storage,
	request_image,
	get_random_art,
	find_art_by_id,

	// CRUD operations: Create, update, delete
	reset_gallery,
	store_user_art,
	cache_art,
	delete_art,
	update_art,
};
