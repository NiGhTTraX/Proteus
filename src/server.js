function Server(url) {
	var that = this;
	this.data = {};
	this.observers = {};

	// Get the file once and store it.
	// NOTE: this is a blocking call
	$.ajax({
		async: false,
		url: url,
		dataType: "json"
	}).success(function(data) {
		that.data = data;
	}).fail(function() {
		throw new Error("Could not connect to " + url);
	});
}

Server.prototype.addObserver = function(variable, observer) {
	if (!this.observers[variable]) {
		this.observers[variable] = [];
	}

	if (this.observers[variable].indexOf(observer) === -1) {
		this.observers[variable].push(observer);
	}
};

Server.prototype.get = function(data) {
	var that = this,
			response = {};

	if (!$.isArray(data)) {
		return this.data[data];
	}

	$.each(data, function(index, value) {
		response[value] = that.data[value];
	});

	return response;
};

Server.prototype.post = function(data) {
	var that = this;

	$.each(data, function(key, value) {
		that.data[key] = value;

		// Notify all observers.
		if (that.observers[key]) {
			$.each(that.observers[key], function(index, observer) {
				observer.update();
			});
		}
	});
};

