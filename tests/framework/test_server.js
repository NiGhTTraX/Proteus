module("server");
test("connect", function() {
	var s = new Server("test.json");
	deepEqual(s.data, {
		"test": "test",
		"test2": "test2"
	});
});

test("connect_fail", function() {
	throws(function() {
		new Server("404.json");
	}, "Could not connect to test.json");
});

test("get_variable", function() {
	var s = new Server("test.json");

	equal(s.get("test"), "test");
});

test("get_undefined_variable", function() {
	var s = new Server("test.json");

	equal(s.get("undefined"), undefined);
});

test("set_variable", function() {
	var s = new Server("test.json");

	s.post({"test": "changed"});
	equal(s.get("test"), "changed");
});

test("set_new_variable", function() {
	var s = new Server("test.json");

	s.post({"new": "changed"});
	equal(s.get("new"), "changed");
});

test("get_multiple_variables", function() {
	var s = new Server("test.json");

	deepEqual(s.get(["test", "test2"]), {
		"test": "test",
		"test2": "test2"
	});
});

test("set_multiple_variables", function() {
	var s = new Server("test.json");

	s.post({
		"test": "changed",
		"test2": "changed2"
	});
	deepEqual(s.get(["test", "test2"]), {
		"test": "changed",
		"test2": "changed2"
	});
});

test("add_observer_only_once", function() {
	var s = new Server("test.json"),
			o = {"test": true};

	s.addObserver("test", o);
	s.addObserver("test", o);
	deepEqual(s.observers.test, [o]);
});

