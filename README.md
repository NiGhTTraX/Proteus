Proteus
=======

Simple MVC framework


Sample usage
------------

We first have to create a server class that will handle our data. The framework provides a simple implementation that uses a static file to store the data. The file must contain valid JSON data. Data persistence is not available.

```javascript
var s = new Server("test.json");
```

Next, we need to let Proteus know of the server.

```javascript
Proteus.config.server = s;
```

Now that we have the server set up, we can build our first component.

```javascript
Proteus.component("lights", {
	title: "Lights",

	setUp: function(models) {
		models.addLabel("lights", "Lights are", function(value) {
			return value ? "On": "Off";
		});
		models.addToggle("lights", "Toggle lights");
	}
});
```

After we've defined all our components, we need to actually display them.

```javascript
$.each(Proteus.config.components, function(name, component) {
  component.appendTo("#content");
});
```

Components
----------

Using ```Proteus.config.component()``` we can define new components. The function takes two arguments, a unique id and an options dictionary. The dictionary can contain a ```title``` key, which, if unprovided, will be set to ```untittled```. It also must contain a ```setUp``` function which will define what the component does.

The ```setUp``` function will be passed as its first argument a ```Models``` object which can be used to attach ```views``` to ```models```.


Models
------

Models sit at the base of this framework. Each model represents a variable stored on the server, identified by a name. A ```Model``` object has a ```value``` method which can be used to get, or set the current value of the model.

A model can have any number of views attached via the ```addView``` method which takes a view object as its only argument. When the value of the model is changed, all views are notified by calling their ```update``` method.

You can have more than one model observing the same variable. Models are component specific, not variable specific. When the value of the observed variable changes, all models attached to it are notified by calling their ```notify``` method.


Views
-----

There are 3 predefined views available: ```LabelView```, ```SpinnerView``` and ```ToggleView```. Each can be attached to a model using the corresponding method of the ```Models``` object: ```addLabel```, ```addSpinner``` and ```addToggle```. These methods take as their first argument the model to which they should attach the view. The remaining arguments are specific to the view being constructed.

```LabelView``` is used to display the value of a model. It takes as parameters a ```label``` which is the actual text that will be displayed and an optional function which can be used to transform the value that will be displayed next to the label. The function takes as its only argument the value of the model.

```javascript
models.addLabel("mymodel", "my label", function(value) { return value * 2; });
```

```SpinnerView``` will display a [spinner](http://jqueryui.com/spinner/) that allows the user to increment and decrement the value of the model. It takes as parameters a ```label``` which is the actual text that will be displayed.

```javascript
models.addSpinner("mymodel", "my label");
```

```ToggleView``` will display a toggle button that will toggle the value of the model between 2 predefined values. It takes as parameters a ```label``` which is the actual text that will be displayed and an options dictionary which can contain ```onValue``` and/or ```offValue``` that represent the value the model will be set to when the toggle is in the on state, and off state, respectively.


Custom views
------------

If the predefined views are not enough, you can define your own using the ```addCustom``` method of the ```Models``` object. The method takes the name of the model and a dictionary. The dictionary must contain a ```setUp``` function and an ```update``` function.

The ```setUp``` function will be called when the view is constructed. It must return a jQuery object containing the HTML you wish to add to the view. The function will have its context set to an empty dictionary which you can use to store arbitrary data. It will also be passed as the first argument the model itself.

The ```update``` function will be called when a model change occurs and the view needs to be refreshed. Its context will be set to the dictionary discussed above and will have as its first argument the model.

```javascript
models.addCustom("mymodel", {
  setUp: function(model) {
    this.div = $("<div></div>").text(model.value());
    return this.div;
  },
  update: function(model) {
    this.div.text(model.value());
  }
});
```

Demo 
----

Included is a demo representing a possible dashboard for home automation. It includes components used to control the lights, curtains and temperature of the house. Also included are a number of components that showcase how models and views interact.

To run the demo, place the ```demo``` and ```resources``` folders on your web server and open ```demo/index.html```. Trying to run the demo locally will result in a cross-origin error in some browsers (e.g. Chrome) that don't allow local file access.

All components are sortable, meaning they can be dragged around and dropped to change their order. The left sidebar is used to hold a number of components for easy access. You can drag components and drop them to the sidebar, but only if the fit. When the window resizes, any component in the left sidebar that no longer fits will be moved back to the main area.

The order of the components is persisted using cookies.

The chart widget is implemented using [Chart.js](https://github.com/nnnick/Chart.js). Components are made sortable using the [Sortable plugin](jqueryui.com/sortable/) of [jQuery UI](jqueryui.com). Cookies are handled through the [jQuery Cookie plugin](https://github.com/carhartl/jquery-cookie).

Building
--------

Proteus uses the [Grunt](https://github.com/gruntjs/grunt) build system. To
build Proteus, you must have [node.js](https://github.com/joyent/node)
installed and then run the following commands:

```bash
# Install the Grunt CLI.
npm install -g grunt-cli

# Clone the repository.
git clone git@github.com:NiGhTTraX/Proteus.git
cd Proteus

# Install node module dependencies.
npm install

# Run the build task.
grunt
```

If all went well, you will find a minified version in the ```build/``` folder.


Testing
-------

Run ```grunt test``` to run the tests in
[PhantomJS](https://github.com/ariya/phantomjs) or open invidual tests from ```tests/**/*.html```
to run them in your browser. Tests are written using the
[QUnit](http://www.qunitjs.com/) framework and the [jQuery Event Unit Testing
Helpers](https://github.com/jquery/jquery-simulate).
