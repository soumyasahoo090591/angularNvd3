var app = angular.module('myApp', ['nvd3']);

////////////////////// line chart simple ///////////////////////
var line_data = function() {
	var draft = [],
		pending = [],
		completed = [];


	draft.push({
		x: 1,
		y: 45
	});
	pending.push({
		x: 2,
		y: 78
	});
	completed.push({
		x: 3,
		y: 90
	});


	return [{
		values: draft,
		key: 'DRAFT',
		color: '#ff7f0e'
	}, {
		values: pending,
		key: 'PENDING',
		color: 'red'
	}, {
		values: completed,
		key: 'Completed',
		color: '#2ca02c'
	}];
}

var data = line_data();

nv.addGraph(function() {

	var chart = nv.models.lineChart().
	useInteractiveGuideline(true);

	chart.xAxis.axisLabel('Time (ms)').
	tickFormat(d3.format(',r'));

	chart.yAxis.axisLabel('Voltage (v)').
	tickFormat(d3.format('.02f'));

	d3.select('#chart svg')
		.datum(data)
		.transition().duration(500)
		.call(chart);

	nv.utils.windowResize(chart.update);

	return chart;
});

///////////////////// Line with focous////////////////////////
/*nv.addGraph(function() {
  var chart = nv.models.lineWithFocusChart();

  chart.xAxis
      .tickFormat(d3.format(',f'));

  chart.yAxis
      .tickFormat(d3.format(',.2f'));

  chart.y2Axis
      .tickFormat(d3.format(',.2f'));

  d3.select('#chart svg')
      .datum(testData())
      .transition().duration(500)
      .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});*/


////////////////////// muli bar chart with stacked and grouped //////////////////////////
nv.addGraph(function() {
	var chart = nv.models.multiBarChart();

	chart.xAxis
		.tickFormat(d3.format(',f'));

	chart.yAxis
		.tickFormat(d3.format(',.1f'));

	//chart.margin({top: 30, right: 105, bottom: 30, left: 103});
	chart.groupSpacing(0.5);
	d3.select('#bar svg')
		.datum(bar_data_from_json())
		.transition().duration(500)
		.call(chart);

	nv.utils.windowResize(chart.update);

	return chart;
});


var json_data = [{
	"category": "draft",
	"count": 48,
	"list": [{
		"id": 1932,
		"version": 1,
		"amount": "$1,386.80",
		"baseAmount": "1386.8",
		"requisitionCode": "R0001085",
		"transactionDate": "02/15/2016",
		"vendorName": null,
		"status": "Draft",
		"infoStatus": "draft"
	}, {
		"id": 1912,
		"version": 0,
		"amount": "$106.13",
		"baseAmount": "106.13",
		"requisitionCode": "R0001084",
		"transactionDate": "02/15/2016",
		"vendorName": null,
		"status": "Draft",
		"infoStatus": "draft"
	}]
}, {
	"category": "pending",
	"count": 65,
	"list": [{
		"id": 1098,
		"version": 0,
		"amount": "$418.13",
		"baseAmount": "418.13",
		"requisitionCode": "RSED0007",
		"transactionDate": "10/07/2015",
		"vendorName": "Amco Supplies",
		"status": "Pending",
		"infoStatus": "pending"
	}, {
		"id": 1103,
		"version": 0,
		"amount": "¤399.44",
		"baseAmount": "399.44",
		"requisitionCode": "RSED0012",
		"transactionDate": "10/07/2015",
		"vendorName": "Amco Supplies",
		"status": "Pending",
		"infoStatus": "pending"
	}]
}, {
	"category": "completed",
	"count": 129,
	"list": [{
		"id": 1502,
		"version": 2,
		"amount": "$199.98",
		"baseAmount": "199.98",
		"requisitionCode": "R0001079",
		"transactionDate": "04/29/2015",
		"vendorName": "Canada Place of Toronto",
		"status": "Completed",
		"infoStatus": "completed"
	}, {
		"id": 1480,
		"version": 3,
		"amount": "$190.26",
		"baseAmount": "190.26",
		"requisitionCode": "R0001073",
		"transactionDate": "02/08/2016",
		"vendorName": "Amco Supplies",
		"status": "Completed",
		"infoStatus": "completed"
	}]
}];

var bar_data_from_json = function() {

	var bar_data_json = [];



	for (i = 0; i < json_data.length; i++) {
		var key_value_bar = {
			"key": "",
			"values": []
		};
		var values_x_y = {
			"x": "",
			"y": ""
		};
		key_value_bar["key"] = json_data[i]["category"];
		values_x_y["y"] = json_data[i]["count"];
		key_value_bar["values"].push(values_x_y);
		bar_data_json.push(key_value_bar);
		key_value = {};
		values_x_y = {};
	}

	console.log("category and count", bar_data_json);
	return bar_data_json;
}
var bar_data = function() {
	return stream_layers(3, 10 + Math.random() * 100, .1).map(function(data, i) {
		return {
			key: 'Stream' + i,
			values: data
		};
	});
}

console.log("bar data generating >>>>>", bar_data());

/* Inspired by Lee Byron's test data generator. */
function stream_layers(n, m, o) {
	if (arguments.length < 3) o = 0;

	function bump(a) {
		var x = 1 / (.1 + Math.random()),
			y = 2 * Math.random() - .5,
			z = 10 / (.1 + Math.random());
		for (var i = 0; i < m; i++) {
			var w = (i / m - y) * z;
			a[i] += x * Math.exp(-w * w);
		}
	}
	return d3.range(n).map(function() {
		var a = [],
			i;
		for (i = 0; i < m; i++) a[i] = o + o * Math.random();
		for (i = 0; i < 5; i++) bump(a);
		return a.map(stream_index);
	});
}

/* Another layer generator using gamma distributions. */
function stream_waves(n, m) {
	return d3.range(n).map(function(i) {
		return d3.range(m).map(function(j) {
			var x = 20 * j / m - i / 3;
			return 2 * x * Math.exp(-.5 * x);
		}).map(stream_index);
	});
}

function stream_index(d, i) {
	return {
		x: i,
		y: Math.max(0, d)
	};
}




/**
pie chart 
*/

nv.addGraph(function() {
	var chart = nv.models.pieChart()
		.x(function(d) {
			return d.label
		})
		.y(function(d) {
			return d.value
		})
		.showLabels(true);

	d3.select("#pie svg")
		.datum(generate_pie_chart())
		.transition().duration(1200)
		.call(chart);

	return chart;
});


var generate_pie_chart = function() {

		var pie_data = [];
		for (i = 0; i < json_data.length; i++) {

			var temp = {};

			temp["label"] = json_data[i]["category"];
			temp["value"] = json_data[i]["count"];
			pie_data.push(temp);

		}
		console.log("data generating in pie chart", pie_data);
		return pie_data;
	}
	////////////////// chart with directive /////////////////////
app.directive('bars', function($parse) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div id="chart"></div>',
		link: function(scope, element, attrs) {
			var data = attrs.data.split(','),
				chart = d3.select('#chart')
				.append("div").attr("class", "chart")
				.selectAll('div')
				.data(data).enter()
				.append("div")
				.transition().ease("elastic")
				.style("width", function(d) {
					return d + "%";
				})
				.text(function(d) {
					return d + "%";
				});
		}
	};
});