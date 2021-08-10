import https from "https";

const getCarparkRateURL =
	"https://data.gov.sg/api/action/datastore_search?resource_id=85207289-6ae7-4a56-9066-e6090a3684a5&limit=1";

export function getRecords(records, searchWord, callback) {
	const query = "&q=" + searchWord;
	https.get(getCarparkRateURL + query, (response) => {
		const chunks = [];

		response.on("data", (chunk) => {
			chunks.push(chunk);
		});

		response.on("end", () => {
			const data = JSON.parse(Buffer.concat(chunks));
			for (let record of data.result.records) {
				records.push({
					carpark: record.carpark,
					weekdays_rate_1: record.weekdays_rate_1,
					weekdays_rate_2: record.weekdays_rate_2,
					saturday_rate: record.saturday_rate,
					sunday_publicholiday_rate: record.sunday_publicholiday_rate,
				});
			}
			callback();
		});
	});
}
