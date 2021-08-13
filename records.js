import superagent from "superagent";

const getCarparkRateURL =
	"https://data.gov.sg/api/action/datastore_search?resource_id=85207289-6ae7-4a56-9066-e6090a3684a5&limit=1";

const getLatLongURL =
	"https://developers.onemap.sg/commonapi/search?returnGeom=Y&getAddrDetails=N&pageNum=1";

const getStaticMap =
	"https://developers.onemap.sg/commonapi/staticmap/getStaticImage?layerchosen=default&zoom=17&height=512&width=512";

const makeRequest = async (url, queries) => {
	const res = await superagent.get(url).query(queries);
	if (res.type === "image/png")
		return Buffer.from(res.body, "hex").toString("base64");
	else return JSON.parse(res.res.text);
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
	let carparkStaticMap = await makeRequest(getStaticMap, carparkStaticMapQuery);

	const record = {
		carpark: carparkRatesData.carpark,
		weekdays_rate_1: carparkRatesData.weekdays_rate_1,
		weekdays_rate_2: carparkRatesData.weekdays_rate_2,
		saturday_rate: carparkRatesData.saturday_rate,
		sunday_publicholiday_rate: carparkRatesData.sunday_publicholiday_rate,
		staticMap: carparkStaticMap,
	};

	return record;
}
