$(document).ready(function() {
	// The sidebar should only accept components that fit.
	$("#c").on("sortstart", function(e, ui) {
		var h = ui.item.outerHeight(true),
				f = $("#footer").offset().top,
				l = $("#ls .component:last"),
				lo = l.length ? l.offset().top + l.outerHeight(true) : $("#ls").offset().top,
				coef = 0.9;

		if (lo + h * coef >= f) {
			$("#ls").addClass("full");
			$(this).sortable("refresh");
		}
	}).on("sortstop", function() {
		$("#ls").removeClass("full");
	});

	// When the window resizes, move any components that don't fit in the sidebar
	// anymore to the main area.
	$(window).resize(function() {
		var f = $("#footer").offset().top;

		$("#ls .component").filter(function() {
			return $(this).offset().top + $(this).outerHeight(true) > f;
		}).appendTo("#c");

		// Update the sortable and trigger the cookie save.
		$("#ls, #c").sortable("refresh");
		$("#ls, #c").trigger("sortupdate");
	});
});

