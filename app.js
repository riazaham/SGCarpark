import express from "express";
import { getDate } from "./date.js";
import https from "https";
import { getRecords } from "./records.js";

const app = express();
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const getCarparkRateURL =
	"https://data.gov.sg/api/action/datastore_search?resource_id=85207289-6ae7-4a56-9066-e6090a3684a5&limit=5";

app.get("/", (req, res) => {
	const date = getDate();
	res.render("home.ejs", { date: date });
});

app.get("/search", (req, res) => {
	const records = [];
	getRecords(records, () => res.render("search.ejs", { records: records }));
});

app.post("/search", (req, res) => {
	res.redirect("/search");
});

app.listen(3000, () => console.log("Server started on port 3000."));
