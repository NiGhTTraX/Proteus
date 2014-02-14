$(document).ready(function() {
	$(".s").sortable({
		connectWith: ".s:not(.full)",
		placeholder: "component placeholder",
		forcePlaceholderSize: true,
		helper: "clone",
		handle: ".handle",
		appendTo: document.body
	}).on("sortupdate", function() {
		// Store the order in a cookie.
		$.cookie($(this).data("cookie"), $(this).sortable("toArray"));
	});

	$("#ls").sortable("option", "appendTo", "parent");
});

