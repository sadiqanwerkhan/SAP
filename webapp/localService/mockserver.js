sap.ui.define(["sap/ui/core/util/MockServer"], function (MockServer) {
	"use strict";

	let oMockServer;

	return {
		init: function () {
			return new Promise(function (resolve, reject) {
				if (oMockServer) {
					resolve();
					return;
				}
				try {
					const sRootUri = "/v2/todo/";
					oMockServer = new MockServer({
						rootUri: sRootUri
					});

					MockServer.config({
						autoRespond: true,
						autoRespondAfter: 250
					});

					oMockServer.simulate(sap.ui.require.toUrl("ui5/app/localService/metadata.xml"), {
						sMockdataBaseUrl: sap.ui.require.toUrl("ui5/app/localService/mockdata"),
						bGenerateMissingMockData: true
					});
					oMockServer.start();
					resolve();
				} catch (oError) {
					if (oMockServer) {
						oMockServer.stop();
					}
					reject(oError);
				}
			});
		}
	};
});
