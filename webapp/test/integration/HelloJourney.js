/* global QUnit */
sap.ui.define(["sap/ui/test/opaQunit", "./pages/Main"], function (opaTest) {
	"use strict";

	QUnit.module("ToDo Journey");

	opaTest("Should load todo list", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "ui5.app"
			}
		});

		// Assertions
		Then.onTheMainPage.iShouldSeeTodoList();
		Then.onTheMainPage.iShouldSeeAtLeastOneTodo();

		// Cleanup
		Then.iTeardownMyApp();
	});

});
