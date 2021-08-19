import express from "express";
import { getDate } from "./date.js";
import { getCarparkNames, getMap, getRates, getRecord } from "./records.js";

const app = express();
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let carparkNames = [];
let date = "";
let record = {};
let loading = true;
let map = "";

app.get("/", (req, res) => {
	if (loading) res.render("partials/loading.ejs");
	else {
		res.render("home.ejs", {
			date: date,
			record: record,
			searchWord: "",
			carparkNames: carparkNames,
			map: map,
		});
	}
});

app.get("/api/loading", async (req, res) => {
	if (carparkNames.length == 0) carparkNames = await getCarparkNames();
	date = getDate();
	record = await getRates("");
	map = await getMap(record.carpark);
	map = "data:image/png;base64," + map;
	loading = false;
	res.redirect("/");
});

app.post("/api/getRates", async (req, res) => {
	const searchWord = req.body.searchWord;
	await getRates(searchWord).then(
		(response) => res.send(response),
		(error) => {
			console.log(error);
			res.send({
				carpark: "Carpark Not Found",
				weekdays_rate_1: "-",
				weekdays_rate_2: "-",
				saturday_rate: "-",
				sunday_publicholiday_rate: "-",
			});
		}
	);
});

app.post("/api/getMap", async (req, res) => {
	const carpark = req.body.carpark;
	await getMap(carpark).then(
		(response) => res.send("data:image/png;base64," + response),
		(error) => {
			console.log(error);
			res.send("/images/mapError.png");
		}
	);
});

app.get("/search/:searchWord", async (req, res) => {
	const date = getDate();
	const searchWord = req.params.searchWord;
	const record = await getRecord(searchWord);
	res.render("home.ejs", {
		date: date,
		record: record,
		searchWord: searchWord,
		carparkNames: carparkNames,
		map: map,
	});
});

app.post("/search", (req, res) => {
	res.redirect("/search/" + req.body.searchWord);
});

app.listen(3000, () => console.log("Server started on port 3000."));
