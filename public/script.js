//Initial state
$("#carpark-names").hide();
$("#suggestion").hide();

$(document).ready(() => {
	//Form submit listener
	$("#search-form").on("submit", (e) => {
		//Loading shimmer effect
		$("#search-google-btn")
			.removeClass("btn btn-info shadow-none")
			.addClass("td-loading shine");
		$("#search-google-btn").html("&nbsp");
		$("#map-result")
			.removeClass("map-result")
			.addClass("map-result-loading shine");

		$(".td-value").html('<div class="td-loading shine"></div>');
		$("#map-img").attr("src", "");

		//Fetch 2 APIs (chained) - rate and map
		const searchWord = $("#search-input").val();
		axios.post("/api/getRates", { searchWord: searchWord }).then(
			(response) => {
				const rate = response.data;
				axios.post("/api/getMap", { carpark: rate.carpark }).then(
					(response) => {
						$("#map-result")
							.removeClass("map-result-loading shine")
							.addClass("map-result");
						$("#map-img").attr("src", response.data);
					},
					(error) => console.log(error)
				);

				//Remove loading shimmer and restore content design
				$(".td-value").each((i, element) => {
					element.innerHTML = [
						rate.carpark,
						rate.weekdays_rate_1,
						rate.weekdays_rate_2,
						rate.saturday_rate,
						rate.sunday_publicholiday_rate,
					][i];
				});
				$("#search-google-btn")
					.removeClass("td-loading shine")
					.addClass("btn btn-info shadow-none");
				$("#search-google-btn").html(
					'View on Google Maps <i class="bi bi-box-arrow-up-right ms-1"></i>'
				);
				$("#search-google-btn").attr(
					"href",
					"https://maps.google.com/?q=" + rate.carpark
				);
			},
			(error) => console.log(error)
		);
		e.preventDefault();
	});

	$("#search-input").on("input focus", async (e) => {
		let searchData = await axios.get("/api/getNames");
		searchData = searchData.data.carparkNames.filter((name) =>
			name.toLowerCase().includes(e.target.value.toLowerCase())
		);
		$("#carpark-names").show();
		$(".suggestion").each((i, element) => {
			if (searchData[i] !== undefined) {
				$(element).html(searchData[i]);
				$(element).show();
			} else $(element).hide();
		});
	});

	$("body").on("click", (e) => {
		if (e.target.id !== "search-input") $("#carpark-names").hide();
	});

	$("#carpark-names").on("click", (e) => {
		$("#search-input").val($("#" + e.target.id).html());
	});

	$(".suggestion").each((i, element) => {
		$(element).on("mouseover", () =>
			$(element).css("background-color", "whitesmoke")
		);
		$(element).on("mouseout", () =>
			$(element).css("background-color", "white")
		);
	});
});