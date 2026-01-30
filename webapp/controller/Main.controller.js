sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (
    Controller,
    Fragment,
    JSONModel,
    MessageToast,
    Filter,
    FilterOperator,
  ) {
    "use strict";

    return Controller.extend("milestone.controller.Main", {
      onInit: function () {
      },
      onOpenDetailDialog: function (oEvent) {
        var oView = this.getView();
        var oButton = oEvent.getSource();

        var oBindingContext = oButton.getBindingContext();

        if (!oBindingContext) {
          var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
          MessageToast.show(oResourceBundle.getText("errorRowDataRead"));
          return;
        }

        var oSelectedRowData = {
          Vbeln: oBindingContext.getProperty("Vbeln"),
          Post1: oBindingContext.getProperty("Post1"),
          Waerk: oBindingContext.getProperty("Waerk"),
          TopFaturalanan: oBindingContext.getProperty("TopFaturalanan"),
          TopAcikBakiye: oBindingContext.getProperty("TopAcikBakiye"),
          CustomerName: oBindingContext.getProperty("CustomerName"), // Eğer main entity'de varsa
        };
        if (!this._pDetailDialog) {
          this._pDetailDialog = Fragment.load({
            id: oView.getId(),
            name: "milestone.view.DetailDialog",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._pDetailDialog.then(
          function (oDialog) {
            oDialog.setBusy(true);
            oDialog.open();

            this._loadDetailData(oSelectedRowData, oDialog);
          }.bind(this),
        );
      },

      _loadDetailData: function (oHeaderData, oDialog) {
        var oModel = this.getView().getModel();

        var sDetailEntitySet = "/GetDetailDataSet";

        var aFilters = [];
        aFilters.push(
          new Filter("Vbeln", FilterOperator.EQ, oHeaderData.Vbeln),
        );

        oModel.read(sDetailEntitySet, {
          filters: aFilters,
          success: function (oData) {

            var oViewModelData = oHeaderData;
            oViewModelData.ToItems = oData.results;

            var oDetailModel = new JSONModel(oViewModelData);
            oDialog.setModel(oDetailModel, "detailModel");
            oDialog.setBusy(false);
          }.bind(this),
          error: function (oError) {
            oDialog.setBusy(false);

            var oDetailModel = new JSONModel(oHeaderData);
            oDialog.setModel(oDetailModel, "detailModel");

            var oResourceBundle = oDialog.getModel("i18n").getResourceBundle();
            MessageToast.show(oResourceBundle.getText("errorDetailsFetch"));
          },
        });
      },
      onCloseDetailDialog: function () {
        this.byId("detailDialog").close();
      },
    });
  },
);
