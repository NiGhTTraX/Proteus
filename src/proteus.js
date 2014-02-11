/* exported Proteus */
var Proteus = {
	config: {
		components: {},
		server: null
	},

	component: function(id, options) {
		if (this.config.components[id]) {
			throw Error("Component '" + id + "' already exists");
		}

		options.id = id;
		this.config.components[id] = $("<div></div>").component(options);
	}
};
/* exported Proteus */

