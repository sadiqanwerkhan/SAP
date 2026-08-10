sap.ui.define(["./BaseController"], function (BaseController) {
	"use strict";

	return BaseController.extend("ui5.app.controller.Detail", {
		onInit: function () {
			this.getRouter().getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			const sTodoId = oEvent.getParameter("arguments").todoId;
			this.getView().bindElement({
				path: "/Todos('" + sTodoId + "')"
			});
		}
	});
});