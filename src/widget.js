function Models() {
	this._models = {};
}

Models.prototype._getModel = function(name) {
	/* Helper function */
	if (!this._models[name]) {
		this._models[name] = new Model(name);
	}

	return this._models[name];
};

Models.prototype.addLabel = function(name, label, func) {
	/**
	 * Attach a label view to the given model.
	 *
	 * Args:
	 *	name: The name of the model.
	 *	label: The text to be displayed in the label.
	 *	func: If given will be called on the model and the returned value will be
	 *	      set in the label.
	 */
	var m = this._getModel(name);

	if (!func) {
		func = function(value) { return value; };
	}

	m.addView(new LabelView(m, label, func));
};

Models.prototype.addToggle = function(name, label, o) {
	/**
	 * Attach a toggle view to the given model.
	 *
	 * Args:
	 *	name: The name of the model.
	 *	label: The text to be displayed in the label.
	 *	o: Options for the toggle button. Can contain onValue and offValue.
	 */
	var m = this._getModel(name);

	m.addView(new ToggleView(m, label, o));
};

Models.prototype.addSpinner = function(name, label) {
	/**
	 * Attach a spinner view to the given model.
	 *
	 * Args:
	 *	name: The name of the model.
	 *	label: The text to be displayed in the label.
	 */
	var m = this._getModel(name);

	m.addView(new SpinnerView(m, label));
};

Models.prototype.addCustom = function(name, o) {
	/**
	 * Attach a custom view to the given model.
	 *
	 * Args:
	 *	name: The name of the model.
	 *	o: Function or dictionary.
	 *
	 *	   If it's a function then it will be called and must return a suitable
	 *	   view. The context of the function will be set to the model which will
	 *	   also be passed as the first parameter.
	 *
	 *	   If it's a dictionary, it must contain setUp and update, which should
	 *	   both be functions. setUp will be called when the view is constructed
	 *	   and update will be called when any model change occurs.
	 *
	 *	   setUp will have its context set to an empty dictionary which can be
	 *	   used to store arbitrary data. It will also be passed the model as the
	 *	   first parameter.
	 *
	 *	   update will have its context set to the above dictionary and will be
	 *	   passed the model as the first parameter.
	 */
	var m = this._getModel(name);

	if ($.isFunction(o)) {
		m.addView(o.call(m, m));
	} else {
		m.addView(new CustomView(m, o.setUp, o.update));
	}
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
		$("<div></div>").addClass("title").text(this.options.title).appendTo(this.element);
		$("<div></div>").addClass("handle").appendTo(this.element);

		this.options.setUp.call(this.element, this.models);

		// Add the views.
		$.each(this.models._models, function(index, model) {
			$.each(model.views, function(index, view) {
				view.widget.appendTo(that.element);
			});
		});
	},

	refresh: function() {
		// Notify the views.
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

	this.widget = $("<div></div>").addClass("label view");
	$("<div></div>").addClass("left").text(label).appendTo(this.widget);
	this.value = $("<div></div>").addClass("right").text(func(model.value()));

	this.value.appendTo(this.widget);
}

LabelView.prototype.update = function() {
	this.value.text(this.func(this.model.value()));
};


function ToggleView(model, label, o) {
	var defaults = {
		onValue: true,
		offValue: false
	};
	this.options = $.extend(defaults, o);

	this.model = model;
	var that = this;

	this.widget = $("<div></div>").addClass("toggle view");

	var l = $("<label></label").text(label).appendTo(this.widget);
	var s = $("<div></div>").addClass("switch");
	this.button = $("<input>").attr("type", "checkbox").appendTo(s);
	if (model.value()) {
		this.button.prop("checked", true);
	}
	this.button.click(function() {
		if ($(this).is(":checked")) {
			model.value(that.options.onValue);
		} else {
			model.value(that.options.offValue);
		}
	});
	$("<div></div>").addClass("led").appendTo(s);

	s.appendTo(l);
}

ToggleView.prototype.update = function() {
	if (this.model.value() === this.options.onValue) {
		this.button.prop("checked", true);
	} else {
		this.button.prop("checked", false);
	}
};

function SpinnerView(model, label) {
	this.model = model;
	this.widget = $("<div></div>").addClass("spinner view");
	$("<div></div>").addClass("left").text(label).appendTo(this.widget);
	var r = $("<div></div>").addClass("right").appendTo(this.widget);
	this.input = $("<input>").val(model.value()).appendTo(r).spinner();
	this.input.on("spinstop", function() {
		model.value($(this).spinner("value"));
	});
}

SpinnerView.prototype.update = function() {
	this.input.spinner("value", this.model.value());
};

function CustomView(model, setUp, update) {
	this.model = model;
	this.data = {};

	this.widget = setUp.call(this.data, model).addClass("custom view");
	this.updateFunc = update;
}

CustomView.prototype.update = function() {
	this.updateFunc.call(this.data, this.model);
};

