sap.ui.define(
	["./BaseController", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/Sorter", "sap/m/MessageToast", "sap/m/MessageBox"],
	function (BaseController, JSONModel, Filter, FilterOperator, Sorter, MessageToast, MessageBox) {
	"use strict";

	return BaseController.extend("ui5.app.controller.Main", {
		onInit: function () {
			this.setModel(new JSONModel({
				newTodoTitle: "",
				newTodoPriority: "Medium",
				searchQuery: "",
				filterMode: "all",
				sortKey: "CreatedAt",
				busy: false,
				totalCount: 0,
				openCount: 0,
				doneCount: 0,
				highCount: 0,
				completionPercent: 0,
				queryApplied: false
			}), "view");
		},

		onCreateTodo: function () {
			const oViewModel = this.getModel("view");
			const oModel = this.getModel();
			const sTitle = (oViewModel.getProperty("/newTodoTitle") || "").trim();

			if (!sTitle) {
				MessageToast.show("Enter a task title first.");
				return;
			}
			if (sTitle.length > 120) {
				MessageToast.show("Title must be 120 characters or fewer.");
				return;
			}

			const oDueDatePicker = this.byId("dueDatePicker");
			const oPayload = {
				ID: String(Date.now()),
				Title: sTitle,
				Priority: oViewModel.getProperty("/newTodoPriority"),
				Completed: false,
				CreatedAt: new Date(),
				DueDate: oDueDatePicker.getDateValue()
			};

			oViewModel.setProperty("/busy", true);
			const iBusyGuard = setTimeout(function () {
				oViewModel.setProperty("/busy", false);
				MessageToast.show("Request timed out. Please try again.");
			}, 10000);

			const fnCleanupBusy = function () {
				clearTimeout(iBusyGuard);
				oViewModel.setProperty("/busy", false);
			};

			oModel.metadataLoaded().then(function () {
				oModel.create("/Todos", oPayload, {
					success: function () {
						oViewModel.setProperty("/newTodoTitle", "");
						oDueDatePicker.setDateValue(null);
						fnCleanupBusy();
						oModel.refresh(true);
						this._updateSummary();
						MessageToast.show("Task created.");
					}.bind(this),
					error: function () {
						fnCleanupBusy();
						MessageToast.show("Could not create task.");
					}
				});
			}.bind(this)).catch(function () {
				fnCleanupBusy();
				MessageToast.show("Service metadata failed to load.");
			});
		},

		onToggleCompleted: function (oEvent) {
			const oCheckBox = oEvent.getSource();
			const bCompleted = oEvent.getParameter("selected");
			const oContext = oCheckBox.getBindingContext();
			const oModel = this.getModel();
			const sPath = oContext.getPath();
			const oData = oContext.getObject();

			oModel.update(sPath, {
				ID: oData.ID,
				Title: oData.Title,
				Priority: oData.Priority,
				Completed: bCompleted,
				DueDate: oData.DueDate,
				CreatedAt: oData.CreatedAt
			}, {
				merge: true
			});
			this._updateSummary();
		},

		onDeleteTodo: function (oEvent) {
			const oItem = oEvent.getParameter("listItem");
			const oContext = oItem.getBindingContext();
			const sTitle = oContext.getProperty("Title");

			MessageBox.confirm("Delete \"" + sTitle + "\"?", {
				title: "Confirm Delete",
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.OK) {
						this.getModel().remove(oContext.getPath());
						this._updateSummary();
						MessageToast.show("Task deleted.");
					}
				}.bind(this)
			});
		},

		onEditTodo: function (oEvent) {
			const sPath = oEvent.getSource().getBindingContext().getPath();
			if (!this._pEditDialog) {
				this._pEditDialog = this.loadFragment({ name: "ui5.app.view.EditTodo" });
			}
			this._pEditDialog.then(function (oDialog) {
				oDialog.bindElement(sPath);
				oDialog.open();
			});
		},

		onOpenDetail: function (oEvent) {
			const sId = oEvent.getSource().getBindingContext().getProperty("ID");
			this.getRouter().navTo("detail", { todoId: sId });
		},

		onSaveTodo: function () {
			const oModel = this.getModel();
			oModel.submitChanges({
				success: function () { MessageToast.show("Task updated."); },
				error: function () { MessageToast.show("Could not update task."); }
			});
			this.byId("editTodoDialog").close();
			this._updateSummary();
		},

		onCancelEditTodo: function () {
			this.getModel().resetChanges();
			this.byId("editTodoDialog").close();
		},

		onSearch: function (oEvent) {
			this.getModel("view").setProperty("/searchQuery", oEvent.getParameter("newValue") || "");
			this._applyQueryState();
		},

		onFilterChange: function (oEvent) {
			this.getModel("view").setProperty("/filterMode", oEvent.getParameter("item").getKey());
			this._applyQueryState();
		},

		onSortChange: function (oEvent) {
			this.getModel("view").setProperty("/sortKey", oEvent.getSource().getSelectedKey());
			this._applyQueryState();
		},

		onRefreshList: function () {
			this.getModel().refresh(true);
			this._updateSummary();
			MessageToast.show("Tasks refreshed.");
		},

		onListUpdateFinished: function () {
			const oViewModel = this.getModel("view");
			if (!oViewModel.getProperty("/queryApplied")) {
				oViewModel.setProperty("/queryApplied", true);
				this._applyQueryState();
			}
			this._updateSummary();
		},

		onClearCompleted: function () {
			const oList = this.byId("todoList");
			const aItems = oList.getItems();
			const oModel = this.getModel();

			aItems.forEach(function (oItem) {
				const oContext = oItem.getBindingContext();
				const oData = oContext.getObject();
				if (oData.Completed) {
					oModel.remove(oContext.getPath());
				}
			});
			this._updateSummary();
			MessageToast.show("Completed tasks cleared.");
		},

		onMarkAllOpenDone: function () {
			const oList = this.byId("todoList");
			const aItems = oList.getItems();
			const oModel = this.getModel();

			aItems.forEach(function (oItem) {
				const oContext = oItem.getBindingContext();
				const oData = oContext.getObject();
				if (!oData.Completed) {
					oModel.update(oContext.getPath(), {
						Completed: true
					}, {
						merge: true
					});
				}
			});

			this._updateSummary();
			MessageToast.show("All open tasks marked as done.");
		},

		_applyQueryState: function () {
			const oViewModel = this.getModel("view");
			const aFilters = this._buildListFilters(oViewModel.getProperty("/filterMode"), oViewModel.getProperty("/searchQuery"));
			const oBinding = this.byId("todoList").getBinding("items");
			const oSorter = this._buildSorter(oViewModel.getProperty("/sortKey"));

			if (!oBinding) {
				return;
			}

			oBinding.filter(aFilters);
			oBinding.sort(oSorter);
		},

		_buildSorter: function (sSortKey) {
			if (sSortKey === "Priority") {
				return new Sorter("Priority", false, null, function (a, b) {
					const mRank = {
						High: 3,
						Medium: 2,
						Low: 1
					};
					return (mRank[b] || 0) - (mRank[a] || 0);
				});
			}

			if (sSortKey === "DueDate") {
				return new Sorter("DueDate", false);
			}

			return new Sorter("CreatedAt", true);
		},

		_updateSummary: function () {
			const oList = this.byId("todoList");
			const oViewModel = this.getModel("view");
			const aItems = oList.getItems();
			let iOpen = 0;
			let iDone = 0;
			let iHigh = 0;

			aItems.forEach(function (oItem) {
				const oData = oItem.getBindingContext().getObject();
				if (oData.Completed) {
					iDone += 1;
				} else {
					iOpen += 1;
				}
				if (oData.Priority === "High") {
					iHigh += 1;
				}
			});

			const iTotal = aItems.length;
			oViewModel.setProperty("/totalCount", iTotal);
			oViewModel.setProperty("/openCount", iOpen);
			oViewModel.setProperty("/doneCount", iDone);
			oViewModel.setProperty("/highCount", iHigh);
			oViewModel.setProperty("/completionPercent", iTotal ? Math.round((iDone / iTotal) * 100) : 0);
		},

		_buildListFilters: function (sMode, sSearchQuery) {
			const aFilters = [];
			const sTrimmedQuery = (sSearchQuery || "").trim();

			if (sMode === "open") {
				aFilters.push(new Filter("Completed", FilterOperator.EQ, false));
			} else if (sMode === "done") {
				aFilters.push(new Filter("Completed", FilterOperator.EQ, true));
			}

			if (sTrimmedQuery) {
				aFilters.push(new Filter("Title", FilterOperator.Contains, sTrimmedQuery));
			}

			return aFilters;
		}
	});
});
