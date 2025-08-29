const METMUSEUM_URL =
	"https://collectionapi.metmuseum.org/public/collection/v1/";

const encode_query = (terms) => {
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
 * @param query {string} String of terms
 * @return {Promise<array>} List of IDs for each image that matches the query
 */
const query_gallery = async (query) => {
	if (!query) {
		return [];
	}

	// URL composition:
	// ?dateBegin=begin&dateEng=end
	// ?hasImages=true
	// ?q=query
	const url =
		METMUSEUM_URL + `search?q=${encode_query(query)}?hasImages=true`;

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
 * Request image from MetMuseum using it's ID
 *
 * @param id {int} MetMuseum valid ID
 * @return {Promise<dictionary>|null} Image metadata
 */
const request_image = async (id) => {
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

		return {
			id: result.objectID,
			year: result.accessionYear,
			image_url: result.primaryImage,
			thumbnail_url: result.primaryImageSmall,
			additional_image_urls: result.additionalImages,
		};
	} catch (err) {
		console.error(`Failed to fetch data from '${url}': ${err.message}`);
		return null;
	}
};

export const collection = {
	query_gallery,
	request_image,
};
