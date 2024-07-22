import UIComponent from "sap/ui/core/UIComponent";
import { IUserAPI } from "../../types/global.types";
import Controller from "sap/ui/core/mvc/Controller";
 
/**
 * @namespace com.ndbs.managementplaneui.util.session
 */
export default class UserAPI {
    private sourceController:Controller | UIComponent
    public ID: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public nameAbbreviation: string;

    constructor(controller: Controller | UIComponent){
        this.sourceController = controller;
    }
 
    public async getLoggedOnUser(): Promise<IUserAPI> {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/comndbsmanagementplaneui/user-api/currentUser",
                method: "GET",
                success: (data: string | IUserAPI) => {
                    const user = typeof data === "string" ? JSON.parse(data) as IUserAPI : data;
                    // this.ID = user.name;
                    this.firstName = user.firstname;
                    this.lastName = user.lastname;
                    this.email = user.email;
                    this.nameAbbreviation = this.firstName.substring(0, 1) + this.lastName.substring(0, 1);
                    resolve(user);
                }
            });
        });
    }
}