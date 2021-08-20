import superagent from "superagent";

const getCarparkRateURL =
	"https://data.gov.sg/api/action/datastore_search?resource_id=85207289-6ae7-4a56-9066-e6090a3684a5";

const getLatLongURL =
	"https://developers.onemap.sg/commonapi/search?returnGeom=Y&getAddrDetails=N&pageNum=1";

const getStaticMapURL =
	"https://developers.onemap.sg/commonapi/staticmap/getStaticImage?layerchosen=default&zoom=17&height=512&width=512";

const makeRequest = async (url, queries) => {
	const res = await superagent
		.get(url)
		.query(queries)
		.catch((err) => console.log(err));
	switch (url) {
		case getCarparkRateURL:
		case getLatLongURL:
			return JSON.parse(res.res.text);
		case getStaticMapURL:
			return Buffer.from(res.body, "hex").toString("base64");
		default:
			return console.log("ERROR with API endpoint:", url);
	}
};

export async function getNames() {
	const carparkNamesQuery = "&fields=carpark";
	let carparkNamesData = await makeRequest(
		getCarparkRateURL,
		carparkNamesQuery
	);
	carparkNamesData = carparkNamesData.result.records;
	return carparkNamesData.map((data) => data.carpark);
}

export async function getRates(searchWord) {
	const carparkRatesQuery = "&q=" + parseSearchWord(searchWord) + "&limit=1";
	let carparkRatesData = await makeRequest(
		getCarparkRateURL,
		carparkRatesQuery
	);
	carparkRatesData = carparkRatesData.result.records[0];

	return {
		carpark: carparkRatesData.carpark,
		weekdays_rate_1: carparkRatesData.weekdays_rate_1,
		weekdays_rate_2: carparkRatesData.weekdays_rate_2,
		saturday_rate: carparkRatesData.saturday_rate,
		sunday_publicholiday_rate: carparkRatesData.sunday_publicholiday_rate,
	};
}

export async function getMap(carpark) {
	const carparkLatLongQuery = "&searchVal=" + carpark;
	let carparkLatLongData = await makeRequest(
		getLatLongURL,
		carparkLatLongQuery
	);

	carparkLatLongData = carparkLatLongData.results[0];
	const lat = carparkLatLongData.LATITUDE;
	const lng = carparkLatLongData.LONGITUDE;

	const carparkStaticMapQuery =
		"&lat=" +
		lat +
		"&lng=" +
		lng +
		"&points=[" +
		lat +
		"," +
		lng +
		',"255,0,0",' +
		'""]';

	return await makeRequest(getStaticMapURL, carparkStaticMapQuery);
}

const parseSearchWord = (searchWord) => {
	const illegalChars = ["(", ")"];
	let parsedSearchWord = "";
	for (const char of searchWord)
		if (!illegalChars.includes(char)) parsedSearchWord += char;
	return parsedSearchWord;
};
