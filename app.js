import express from "express";
import { getDate } from "./date.js";
import { getCarparkNames, getRecord } from "./records.js";

const app = express();
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let carparkNames = [];

app.get("/", async (req, res) => {
	if (carparkNames.length == 0) carparkNames = await getCarparkNames();
	const date = getDate();
	const record = await getRecord("");
	res.render("home.ejs", {
		date: date,
		record: record,
		searchWord: "",
		carparkNames: carparkNames,
	});
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
