export function isIndefinite(dateDebut, dateFin) {
	let now = new Date();
	dateDebut = new Date(dateDebut);
	dateFin = dateFin ? new Date(dateFin) : null;
	return now >= dateDebut && (!dateFin || dateFin === null);
}

export function isValid(dateDebut, dateFin) {
	let now = new Date();
	dateDebut = new Date(dateDebut);
	dateFin = dateFin ? new Date(dateFin) : null;

	if (now >= dateDebut && (dateFin === null || now <= dateFin)) {
		return true;
	} else {
		return false;
	}
}
