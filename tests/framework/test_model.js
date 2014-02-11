module("model");
test("create_new_model", function() {
	var s = new Server("test.json"),
			m = new Model("test", s);

	equal(m.value(), "test");
});

test("update_model_value", function() {
	var s = new Server("test.json"),
			m = new Model("test", s);

	m.value("changed");
	equal(m.value(), "changed");
	equal(s.get("test"), "changed");
});

test("create_new_model_after_server_change", function() {
	var s = new Server("test.json");

	s.post({"test": "changed"});
	var m = new Model("test", s);
	equal(m.value(), "changed");
});

test("create_multiple_models_for_same_variable", function() {
	var s = new Server("test.json"),
			m1 = new Model("test", s),
			m2 = new Model("test", s);

	equal(m1.value(), "test");
	equal(m2.value(), "test");

	m1.value("changed");
	equal(m1.value(), "changed");
	equal(m2.value(), "changed");
});

test("update_gets_called_only_once", function() {
	var s = new Server("test.json"),
			m1 = new Model("test", s),
			m2 = new Model("test", s),
			update1count = 0,
			update2count = 0;

	m1.update = function() { update1count++; };
	m2.update = function() { update2count++; };
	m1.value("changed");
	equal(update1count, 1);
	equal(update2count, 1);
});

test("model_on_undefined_variable", function() {
	var s = new Server("test.json"),
			m = new Model("undefined", s);

	equal(m.value(), undefined);
});

test("model_on_undefined_variable_gets_notified_when_variable_is_set", function() {
	var s = new Server("test.json"),
			m = new Model("undefined", s);

	s.post({"undefined": "new"});
	equal(m.value(), "new");
});

