/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"milestone/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
