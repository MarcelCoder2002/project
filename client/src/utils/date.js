export function isIndefinite(dateDebut, dateFin) {
	let now = new Date();
	return now >= dateDebut && (!dateFin || dateFin === null);
}

export function isValid(dateDebut, dateFin) {
	let now = new Date();
	dateFin = dateFin ? dateFin : null;

	if (now >= dateDebut && (dateFin === null || now <= dateFin)) {
		return true;
	} else {
		return false;
	}
}
