import express from "express";
import { getDate } from "./date.js";
import { getCarparkNames, getRecord } from "./records.js";

const app = express();
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let carparkNames = [];
let date = "";
let record = {};
let loading = true;

app.get("/", (req, res) => {
	if (loading) res.render("partials/loading.ejs");
	else {
		res.render("home.ejs", {
			date: date,
			record: record,
			searchWord: "",
			carparkNames: carparkNames,
		});
	}
});

app.get("/api/loading", async (req, res) => {
	if (carparkNames.length == 0) carparkNames = await getCarparkNames();
	date = getDate();
	record = await getRecord("");
	loading = false;
	res.redirect("/");
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
	});
});

app.post("/search", (req, res) => {
	res.redirect("/search/" + req.body.searchWord);
});

app.listen(3000, () => console.log("Server started on port 3000."));
