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
	//this.notify();
};

Model.prototype.update = function() {
	this._value = this.server.get(this.name);
	this.notify();
};

Model.prototype.addView = function(view) {
	this.views.push(view);
};

Model.prototype.notify = function() {
	$.each(this.views, function(i, view) {
		view.update();
	});
};

