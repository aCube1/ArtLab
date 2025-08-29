/**
 * @typedef ArtObject
 * @type {object}
 * @property {number} id - Unique ID
 * @property {number} year - Release year
 * @property {URL} image_url - Primary image URL
 * @property {URL} thumbnail_url - Thumbnail image URL
 * @property {Array<URL>} additional_image_urls - Additional images URLs
 */

const METMUSEUM_URL =
	"https://collectionapi.metmuseum.org/public/collection/v1/";

const STORAGE_KEY = "artslab::gallery";

const _encode_query = (terms) => {
	// Code partially stolen from: https://chatgpt.com
	// "([^"])*" -> Everything between " except "
	// '([^'])*' -> Everything between ' except '
	// [^ \t]* -> Everything except spaces or tabs
	const regex = /"([^"]+)"|'([^']+)'|[^ \t]+/g;

	const tokens = [...terms.matchAll(regex)].map((item) => {
		if (item[1] !== undefined) {
			// Matches the "
			return `"${item[1]}"`;
		} else if (item[2] !== undefined) {
			// Matches '
			return `'${item[2]}'`;
		}

		return item[0];
	});

	return tokens.map((token) => encodeURIComponent(token)).join("+");
};

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
	// ?q=query
	const url =
		METMUSEUM_URL + `search?q=${_encode_query(query)}?hasImages=true`;

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

const _request_storage = () => {
	const storage = localStorage.getItem(STORAGE_KEY);
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
const request_image = async (id) => {
	// Firstly, check if ID is already in localStorage
	const storage_data = _request_storage();
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
			throw new Error(`Invalid`);
		}

		const art_metadata = {
			id: result.objectID,
			year: result.accessionYear,
			image_url: result.primaryImage,
			thumbnail_url: result.primaryImageSmall,
			additional_image_urls: result.additionalImages,
		};

		// Cache art in localStorage for future requests
		return art_metadata;
	} catch (err) {
		console.error(`Failed to fetch data from '${url}': ${err.message}`);
		return null;
	}
};

const reset_gallery = () => {
	localStorage.removeItem(STORAGE_KEY);
	console.log("Art gallery cleared!");
};

/**
 * Store art object in localStorage. If art with ID already exists, delete it
 * before storing the new one
 *
 * @param {ArtObject} art - Art object
 */
const store_art = (art) => {
	const storage_data = _request_storage();
	const matches = storage_data.filter((img) => img.id == art.id);
	if (matches.length > 0 && matches[0]) {
		delete_art(matches[0].id);
		console.warn(
			`Art with ID ${matches[0].id} already exists! Deleting it... :D`,
		);
	}

	localStorage.setItem(STORAGE_KEY, JSON.stringify([...storage_data, art]));
};

/**
 * Delete art stored in localStorage
 *
 * @param {number} id - Unique ID
 * @return {ArtObject} Gallery list without ID's art
 */
const delete_art = (id) => {
	const storage_data = _request_storage();
	const filtered_gallery = storage_data.filter((img) => img.id != id);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered_gallery));

	console.log(`Art with ID ${id} from local gallery was deleted`);
	return filtered_gallery;
};

const _encode_file_as_base64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => resolve(reader.result);

		reader.onerror = () => reject(reader.onerror);

		reader.readAsDataURL(file);
	});
};

/**
 * Create new art object with provided metadata.
 *
 * @see update_art_image update_art_metadata
 * @return {Promise<ArtObject>} - New art with metadata
 */
const create_art_object = async (id, year, image, thumbnail = null) => {
	return {
		...update_art_metadata({}, id, year),
		...(await update_art_image({}, image, thumbnail)),
	};
};

/**
 * Update art's metadata with user's provided info
 *
 * @param {ArtObject} art - List with art's metadata
 * @param {number} id - Unique ID
 * @param {number} year - Release year
 * @return {ArtObject} Updated list with new metadata
 */
const update_art_metadata = (art, id, year) => {
	return {
		...art,
		id: id,
		year: year,
	};
};

/**
 * Update art's image and thumbnail using user's provided data
 *
 * @param {ArtObject} art - List with art's metadata
 * @param {File} image - Image data
 * @param {File?} thumbnail - Thumbail's data <optional>
 * @return {Promise<(ArtObject|null)>} Updated list with new image and thumbnail
 */
const update_art_image = async (art, image, thumbnail = null) => {
	const img_data = await _encode_file_as_base64(image);
	const thumb_data = thumbnail
		? await _encode_file_as_base64(thumbnail)
		: img_data;

	if (!img_data || !thumb_data) {
		console.error(`Failed to read image file`);
		return null;
	}

	console.log(`Art with ID '${id} image was updated'`);
	return {
		...art,
		image_url: img_data,
		thumbnail_url: thumb_data,
	};
};

export const collection = {
	// MetMuseum database reading
	query_gallery,
	request_image,

	// CRUD operations: Create, update, delete
	reset_gallery,
	store_art,
	delete_art,
	create_art_object,
	update_art_metadata,
	update_art_image,
};
