export function snakeToCapitalCase(str) {
	const words = str.split("_");
	const firstWord =
		words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
	const remainingWords = words.slice(1).join(" ").toLowerCase();
	return firstWord + " " + remainingWords;
}

export function camelToCapitalCase(str) {
	return str
		.replace(/([A-Z])/g, " $1") // Insère un espace avant chaque majuscule
		.replace(/^./, function (match) {
			return match.toUpperCase();
		}) // Met en majuscule la première lettre
		.toLowerCase() // Met tout en minuscules
		.replace(/^\w/, function (c) {
			return c.toUpperCase();
		}); // Met en majuscule la première lettre du mot transformé
}

export function formatDate(date) {
	return !date
		? "Indéterminé"
		: new Date(date).toLocaleString("fr-FR", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
				// hour: "2-digit",
				// minute: "2-digit",
				// second: "2-digit",
				// hour12: false,
				// timeZone: "UTC", // Assurez-vous que la timezone est correcte
		  });
}

export function formatDatetime(date) {
	return !date
		? "Indéterminé"
		: new Date(date).toLocaleString("fr-FR", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: false,
				// timeZone: "UTC", // Assurez-vous que la timezone est correcte
		  });
}

export function formatPrice(price) {
	return `${price} MAD`;
}

export function formatPercentage(percentage) {
	return `${percentage} %`;
}

export function formatOption(template, values) {
	return template.replace(/%\w+%/g, (match) => {
		const key = match.slice(1, -1);
		return values[key] !== undefined
			? key.startsWith("date")
				? formatDatetime(values[key])
				: values[key]
			: "";
	});
}

export function formatDateForInput(date) {
	date = new Date(date);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formDataToJSON(data) {
	const result = {};
	for (const pair of data) {
		result[pair[0]] = pair[1];
	}
	return result;
}

export function parseKeyFormData(data) {
	const parsedObj = {};
	for (const key of Object.keys(data)) {
		const matches = key.match(/(\w+)\[(\w+)\]/);
		if (matches) {
			const section = matches[1];
			const field = matches[2];
			if (!parsedObj[section]) parsedObj[section] = {};
			parsedObj[section][field] = data[key];
		}
	}
	return parsedObj;
}
