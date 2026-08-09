/* global QUnit */
sap.ui.define(["ui5/app/controller/Main.controller"], function (MainController) {
	"use strict";

	QUnit.module("Main controller filters");

	QUnit.test("Creates filter for open tasks", function (assert) {
		const aFilters = MainController.prototype._buildListFilters("open", "");
		assert.strictEqual(aFilters.length, 1, "One filter created for open mode");
		assert.strictEqual(aFilters[0].sPath, "Completed", "Open filter uses Completed field");
	});

	QUnit.test("Creates filter for done tasks with search", function (assert) {
		const aFilters = MainController.prototype._buildListFilters("done", "test");
		assert.strictEqual(aFilters.length, 2, "Two filters created for mode and query");
		assert.strictEqual(aFilters[1].sPath, "Title", "Search filter uses Title field");
	});

	QUnit.test("Returns no filters for all mode and empty query", function (assert) {
		const aFilters = MainController.prototype._buildListFilters("all", " ");
		assert.strictEqual(aFilters.length, 0, "No filters created");
	});
});
