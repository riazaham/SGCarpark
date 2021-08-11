import superagent from "superagent";

const getCarparkRateURL =
	"https://data.gov.sg/api/action/datastore_search?resource_id=85207289-6ae7-4a56-9066-e6090a3684a5&limit=1";

const getLatLongURL =
	"https://developers.onemap.sg/commonapi/search?returnGeom=Y&getAddrDetails=N&pageNum=1";

const makeRequest = async (url, queries) => {
	const res = await superagent.get(url).query(queries);
	return JSON.parse(res.res.text);
};

export async function getRecord(searchWord) {
	const carparkRatesQuery = "&q=" + searchWord;
	let carparkRatesData = await makeRequest(
		getCarparkRateURL,
		carparkRatesQuery
	);
	carparkRatesData = carparkRatesData.result.records[0];

	const carparkLatLongQuery = "&searchVal=" + carparkRatesData.carpark;
	let carparkLatLongData = await makeRequest(
		getLatLongURL,
		carparkLatLongQuery
	);
	carparkLatLongData = carparkLatLongData.results[0];

	const record = {
		carpark: carparkRatesData.carpark,
		weekdays_rate_1: carparkRatesData.weekdays_rate_1,
		weekdays_rate_2: carparkRatesData.weekdays_rate_2,
		saturday_rate: carparkRatesData.saturday_rate,
		sunday_publicholiday_rate: carparkRatesData.sunday_publicholiday_rate,
		lat: carparkLatLongData.LATITUDE,
		long: carparkLatLongData.LONGITUDE,
	};

	return record;
}
