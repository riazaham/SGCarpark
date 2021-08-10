import express from "express";
import { getDate } from "./date.js";
import https from "https";
import { getRecords } from "./records.js";

const app = express();
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let searchWord = "";

app.get("/", (req, res) => {
	const date = getDate();
	res.render("home.ejs", { date: date });
});

app.get("/search", (req, res) => {
	const records = [];
	getRecords(records, searchWord, () =>
		res.render("search.ejs", { records: records })
	);
});

app.post("/search", (req, res) => {
	searchWord = req.body.searchWord;
	res.redirect("/search");
});

app.listen(3000, () => console.log("Server started on port 3000."));
