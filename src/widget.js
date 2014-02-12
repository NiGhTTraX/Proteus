function Models() {
	this._models = {};
}

Models.prototype.getModel = function(name) {
	if (!this._models[name]) {
		this._models[name] = new Model(name);
	}

	return this._models[name];
};

Models.prototype.addLabel = function(name, label, func) {
	var m = this.getModel(name);

	if (!func) {
		func = function(value) { return value; };
	}

	m.addView(new LabelView(m, label, func));
};

Models.prototype.addToggle = function(name, label) {
	var m = this.getModel(name);

	m.addView(new ToggleView(m, label));
};


$.widget("ntx.component", {
	options: {
		id: null,
		title: "untitled",
		setUp: null,
	},

	_create: function() {
		if (!this.options.id) {
			throw new Error("Must provide a component id");
		}

		var that = this;
		this.models = new Models();

		this.element.attr("id", this.options.id).addClass("component");
		$("<h1></h1>").text(this.options.title).appendTo(this.element);

		this.options.setUp.call(this.element, this.models);

		// Add the views.
		$.each(this.models._models, function(index, model) {
			$.each(model.views, function(index, view) {
				view.widget.appendTo(that.element);
			});
		});
	},

	refresh: function() {
		$.each(this.models._models, function(index, model) {
			$.each(model.views, function(index, view) {
				view.update();
			});
		});
	}
});


function LabelView(model, label, func) {
	this.model = model;
	this.func = func;

	this.widget = $("<div></div>").addClass("label");
	this.text = $("<div></div>").addClass("text").text(label);
	this.value = $("<div></div>").addClass("value").text(func(model.value()));

	this.text.appendTo(this.widget);
	this.value.appendTo(this.widget);
}

LabelView.prototype.update = function() {
	this.value.text(this.func(this.model.value()));
};


function ToggleView(model, label) {
	this.model = model;

	this.widget = $("<div></div>").addClass("toggle");
	this.text = $("<div></div>").addClass("text").text(label);
	this.button = $("<button></button").text(label).button();
	this.button.click(function() {
		model.value(!model.value());
	});

	this.button.appendTo(this.widget);
}

ToggleView.prototype.update = function() {
	//TODO
};

function CustomView(model, html, updateFunc) {
	this.model = model;

	this.widget = $(html);
	this.updateFunc = updateFunc;
}

CustomView.prototype.update = function() {
	this.updateFunc.call(this.widget);
};
