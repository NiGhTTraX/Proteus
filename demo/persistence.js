$.cookie.json = true;

$(document).ready(function() {
	var mainOrder = $.cookie($("#c").data("cookie")),
			leftOrder = $.cookie($("#ls").data("cookie")),
			k = 0;

	// Add components to the main area.
	if (mainOrder) {
		$.each(mainOrder, function(index, value) {
			if (value in Proteus.config.components) {
				Proteus.config.components[value].appendTo("#c");
				delete Proteus.config.components[value];
				k++;
			}
		});
	}

	// Add components to the left sidebar.
	if (leftOrder) {
		$.each(leftOrder, function(index, value) {
			if (value in Proteus.config.components) {
				Proteus.config.components[value].appendTo("#ls");
				delete Proteus.config.components[value];
				k++;
			}
		});
	}

	// Add any remaining components to the main area.
	$.each(Proteus.config.components, function(name, component) {
		component.appendTo("#c");
		k++;
	});

	$("#nr").text(k);
});

