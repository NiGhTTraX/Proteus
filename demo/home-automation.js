Proteus.component("lights", {
	title: "Lights",

	setUp: function(models) {
		models.addLabel("lights", "Lights are", function(value) {
			return value ? "On": "Off";
		});
		models.addToggle("lights", "Toggle lights");
	}
});

Proteus.component("curtains", {
	title: "Curtains",

	setUp: function(models) {
		models.addLabel("curtains", "Curtains are", function(value) {
			return value ? "Open": "Closed";
		});
		models.addToggle("curtains", "Toggle curtains");
	}
});

Proteus.component("custom", {
	title: "Temperature history",

	setUp: function(models) {
		models.addSpinner("temperature", "Current temperature");
		models.addCustom("temperature", {
			setUp: function(model) {
				this.maxPoints = 8;
				var d = new Date();

				this.data = {
					labels : [ d.getHours() + ":" + d.getMinutes() ],
					datasets : [
						{
							fillColor : "rgba(220,220,220,0.5)",
							strokeColor : "rgba(220,220,220,1)",
							pointColor : "rgba(220,220,220,1)",
							pointStrokeColor : "#fff",
							data : [model.value()]
						}
					]
				};

				this.options = {
					animation: false,
				};

				var o = $("<div></div>").css("text-align", "center");
				var c = $("<canvas></canvas>").attr("width", "180").attr("height", 150);
				c.appendTo(o);
				this.ctx = c.get(0).getContext("2d");
				this.chart = new Chart(this.ctx).Line(this.data, this.options);

				return o;
			},
			update: function(model) {
				// Remove the first datapoint if we reached the limit.
				if (this.data.labels.length === this.maxPoints) {
					this.data.labels.shift();
					this.data.datasets[0].data.shift();
				}

				// Push a new datapoint.
				var d = new Date();
				this.data.labels.push(d.getHours() + ":" + d.getMinutes());
				this.data.datasets[0].data.push(model.value());

				// Update the chart.
				this.chart = new Chart(this.ctx).Line(this.data, this.options);
			}
		});
	}
});

