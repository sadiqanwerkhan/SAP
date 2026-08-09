sap.ui.define(
	["sap/ui/core/UIComponent", "sap/ui/Device", "sap/ui/model/odata/v2/ODataModel", "./model/models", "./localService/mockserver"],
	function (UIComponent, Device, ODataModel, models, mockserver) {
	"use strict";

	return UIComponent.extend("ui5.app.Component", {
		metadata: {
			manifest: "json",
			interfaces: ["sap.ui.core.IAsyncContentCreation"]
		},
		init: function () {
			// call base init first to keep UIComponent lifecycle consistent
			UIComponent.prototype.init.call(this);
			this.setModel(models.createDeviceModel(), "device");

			const fnCreateMainModelAndRoute = function () {
				this.setModel(new ODataModel("/v2/todo/", {
					useBatch: false,
					defaultBindingMode: "TwoWay",
					defaultCountMode: "Inline"
				}));
				this.getRouter().initialize();
			}.bind(this);

			const bLocalRun = /localhost|127\.0\.0\.1/i.test(window.location.hostname);
			if (bLocalRun) {
				mockserver
					.init()
					.then(fnCreateMainModelAndRoute)
					.catch(fnCreateMainModelAndRoute);
				return;
			}

			fnCreateMainModelAndRoute();
		},
		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @returns {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function () {
			if (this.contentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
					this.contentDensityClass = "";
				} else if (!Device.support.touch) {
					// apply "compact" mode if touch is not supported
					this.contentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this.contentDensityClass = "sapUiSizeCozy";
				}
			}
			return this.contentDensityClass;
		}
	});
});
