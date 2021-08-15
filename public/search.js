document.getElementById("search-input").addEventListener("focus", () => {
	document.getElementById("carpark-names").hidden = false;
});

document.addEventListener("click", (e) => {
	if (e.target.id === "search-input")
		document.getElementById("carpark-names").hidden = false;
	else document.getElementById("carpark-names").hidden = true;
});

document.getElementById("carpark-names").addEventListener("click", (e) => {
	const searchWord = document.getElementById(e.target.id).innerHTML;
	document.getElementById("search-input").value = searchWord;
});

["0", "1", "2", "3", "4"].forEach((index) => {
	document.getElementById(index).addEventListener("mouseover", () => {
		document.getElementById(index).style.backgroundColor = "whitesmoke";
	});
	document.getElementById(index).addEventListener("mouseout", () => {
		document.getElementById(index).style.backgroundColor = "white";
	});
});
