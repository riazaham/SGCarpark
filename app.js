import express from "express";
import { getDate } from "./date.js";
import { getRecord } from "./records.js";

const app = express();
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let searchWord = "";

app.get("/", async (req, res) => {
	const date = getDate();
	const record = await getRecord(searchWord);
	res.render("home.ejs", { date: date, record: record });
});

app.get("/search", async (req, res) => {
	res.render("search.ejs", { record: record });
});

app.post("/", (req, res) => {
	searchWord = req.body.searchWord;
	res.redirect("/");
});

app.listen(3000, () => console.log("Server started on port 3000."));

//OneMAP api code
//JDJ5JDEwJG5WRDg0VzRaYlZZaEZkUjFXdmNaeWV2UjNTYzVQMW5salIzM1pvNXY2aGpRQjJOTXNxaklD
//OneMAP token
//eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjc4NjAsInVzZXJfaWQiOjc4NjAsImVtYWlsIjoicmlhemFoYW1AZ21haWwuY29tIiwiZm9yZXZlciI6ZmFsc2UsImlzcyI6Imh0dHA6XC9cL29tMi5kZmUub25lbWFwLnNnXC9hcGlcL3YyXC91c2VyXC9zZXNzaW9uIiwiaWF0IjoxNjI4NjUzNjg5LCJleHAiOjE2MjkwODU2ODksIm5iZiI6MTYyODY1MzY4OSwianRpIjoiYzMwMjFmNzQ5MTI5ZWI5MzBiZjU1Y2YzOGY2ZGY3NmYifQ.-5XuVukSctHRhoWAYz6YVeHK3DkNOWGRH65l-VCKC2o
