export function getDate() {
	const today = new Date();
	const options = {
		day: "numeric",
		month: "short",
		hour: "numeric",
		minute: "2-digit",
	};
	return today.toLocaleDateString("en-US", options);
}
