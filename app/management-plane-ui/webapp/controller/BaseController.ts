import ResourceBundle from "sap/base/i18n/ResourceBundle";
import UIComponent from "sap/ui/core/UIComponent";
import Controller from "sap/ui/core/mvc/Controller";
import Router from "sap/ui/core/routing/Router";
import Model from "sap/ui/model/Model";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { ApplicationModels } from "../types/global.types";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import View from "sap/ui/core/mvc/View";
import Button, { Button$PressEvent } from "sap/m/Button";
import FragmentCL from "ui5/antares/ui/FragmentCL";
import Messaging from "sap/ui/core/Messaging";

/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class BaseController extends Controller {


    /* ======================================================================================================================= */
    /* Global Methods                                                                                                          */
    /* ======================================================================================================================= */

    public getODataModel(modelName?: ApplicationModels): ODataModel {
        return (this.getView() as View).getModel(modelName) as ODataModel;
    }

    public getComponentModel(modelName?: ApplicationModels): ODataModel {
        return (this.getOwnerComponent() as UIComponent).getModel(modelName) as ODataModel;
    }

    public getRouter(): Router {
        return (this.getOwnerComponent() as UIComponent).getRouter();
    }

    public getModel(modelName?: ApplicationModels): Model {
        return this.getView()?.getModel(modelName)!;
    }

    public setModel(oModel: Model, modelName?: string): void {
        this.getView()?.setModel(oModel, modelName);
    }

    public getCurrentView(): View {
        return this.getView() as View
    }

    public getResourceBundle(): ResourceBundle {
        return (((this.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle);
    }

    public onNavToView(target: string): void {
        this.getRouter().navTo(target);
    }

    public openMessagePopover(): void {
        const view = this.getView() as View;
        (view.byId("btnMessages") as Button).firePress();
    } 
    
    public onMessagePopoverPress(event: Button$PressEvent): void {
        const fragment = new FragmentCL(this, "com.ndbs.managementplaneui.fragments.common.MessagePopover", event.getSource());
        fragment.openAsync(true);
    }

    public onClearMessages(): void {
        Messaging.removeAllMessages();
    }    
} 