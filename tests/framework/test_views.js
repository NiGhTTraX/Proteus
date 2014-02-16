module("views");
test("add_one_view", function() {
	var s = new Server("test.json"),
			m = new Model("test", s),
			l = {test: true};


	m.addView(l);
	deepEqual(m.views, [l]);
});

test("add_two_view", function() {
	var s = new Server("test.json"),
			m = new Model("test", s),
			l1 = {test: 1},
			l2 = {test: 2};


	m.addView(l1);
	m.addView(l2);
	deepEqual(m.views, [l1, l2]);
});

test("view_gets_notified", function() {
	var s = new Server("test.json"),
			m = new Model("test", s),
			updateCount = 0;

	function TestView() {
	}
	TestView.prototype.update = function() {
		updateCount++;
	};

	m.addView(new TestView());
	m.value("new");
	equal(updateCount, 1);
});

test("views_get_notified", function() {
	var s = new Server("test.json"),
			m = new Model("test", s);

	function TestView() {
		this.updateCount = 0;
	}
	TestView.prototype.update = function() {
		this.updateCount++;
	};

	var v1 = new TestView(),
			v2 = new TestView();

	m.addView(v1);
	m.addView(v2);

	m.value("new");
	equal(v1.updateCount, 1);
	equal(v2.updateCount, 1);
});

test("label_view", function() {
	var s = new Server("test.json"),
			m = new Model("test", s),
			l = new LabelView(m, "test", function(v) { return v; });

	m.addView(l);

	ok(l.widget.hasClass("view"));
	ok(l.widget.hasClass("label"));
	equal(l.value.text(), "test");

	m.value("new");
	equal(l.value.text(), "new");
});

test("toggle_view", function() {
	var s = new Server("test.json"),
			m = new Model("test", s),
			l = new ToggleView(m, "test", {
				onValue: "test",
				offValue: "new"
			});

	m.addView(l);

	ok(l.widget.hasClass("view"));
	ok(l.widget.hasClass("toggle"));
	ok(l.button.is(":checked"));

	m.value("new");
	ok(!l.button.is(":checked"));

	l.button.trigger("click");
	ok(l.button.is(":checked"));
	l.button.trigger("click");
	ok(!l.button.is(":checked"));
});

test("spinner_view", function() {
	var s = new Server("test.json"),
			m = new Model("test", s);

	m.value(23);

	var l = new SpinnerView(m, "test");

	m.addView(l);

	ok(l.widget.hasClass("view"));
	ok(l.widget.hasClass("spinner"));
	ok(l.input.val(), 23);

	m.value(25);
	ok(l.input.val(), 25);
});

test("custom_view", function() {
	var s = new Server("test.json"),
			m = new Model("test", s);

	function testSetUp(model) {
		this.test = true;
		equal(model.value(), "test");
		return $("<div>test</div>");
	}

	function testUpdate(model) {
		equal(this.test, true);
		equal(model.value(), "new");
	}

	var l = new CustomView(m, testSetUp, testUpdate);

	m.addView(l);

	ok(l.widget.hasClass("view"));
	ok(l.widget.hasClass("custom"));
	equal(l.widget.text(), "test");

	m.value("new");
});

