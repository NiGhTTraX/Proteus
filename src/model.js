function Model(name, server) {
	this.name = name;
	this.server = server || Proteus.config.server;
	this.server.addObserver(name, this);

	this.views = [];
	this._value = this.server.get(this.name);
}

Model.prototype.value = function(newValue) {
	if (newValue === undefined) {
		return this._value;
	}

	this._value = newValue;
	var data = {};
	data[this.name] = newValue;
	this.server.post(data);
};

Model.prototype.update = function() {
	// A change has occured in another view so let's update ourselves.
	this._value = this.server.get(this.name);

	// And notify all our views.
	this.notify();
};

Model.prototype.addView = function(view) {
	this.views.push(view);
};

Model.prototype.notify = function() {
	// Notify all views that a change has occured.
	$.each(this.views, function(i, view) {
		view.update();
	});
};

