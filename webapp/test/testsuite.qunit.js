sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: ui5.app",
		defaults: {
			page: "ui5://test-resources/ui5/app/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "ui5/app/",
				never: "test-resources/ui5/app/"
			},
			loader: {
				paths: {
					"ui5/app": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for ui5.app"
			},
			"integration/opaTests": {
				title: "Integration tests for ui5.app"
			}
		}
	};
});
