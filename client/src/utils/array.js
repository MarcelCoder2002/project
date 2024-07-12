export function difference(arr1, arr2) {
	return arr1.filter((item) => !arr2.includes(item));
}

export function remove(array, item) {
	const index = array.indexOf(item);
	if (index !== -1) {
		array.splice(index, 1);
	}
}

export function removeAll(array, item) {
	return array.filter(function (e) {
		return e !== item;
	});
}

export function containsAll(subset, superset) {
	return subset.every((item) => superset.includes(item));
}

export function withoutDuplicates(liste) {
	return [...new Set(liste)];
}

export function last(list) {
	return list[list.length - 1];
}
