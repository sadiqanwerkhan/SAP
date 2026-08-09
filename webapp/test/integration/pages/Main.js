sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
	"use strict";

	Opa5.createPageObjects({
		onTheMainPage: {
			actions: {},

			assertions: {
				iShouldSeeTodoList: function () {
					return this.waitFor({
						id: "todoList",
						visible: false,
						viewName: "ui5.app.view.Main",
						success: function (oList) {
							Opa5.assert.ok(!!oList, "Todo list is visible.");
						},
						errorMessage: "Todo list is not visible."
					});
				},

				iShouldSeeAtLeastOneTodo: function () {
					return this.waitFor({
						id: "todoList",
						visible: false,
						viewName: "ui5.app.view.Main",
						success: function (oList) {
							Opa5.assert.ok(oList.getItems().length > 0, "List contains at least one todo.");
						},
						errorMessage: "Todo list is not visible."
					});
				}
			}
		}
	});
});
