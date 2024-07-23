import UIComponent from "sap/ui/core/UIComponent";
import { IUserAPI } from "../../types/global.types";
import Controller from "sap/ui/core/mvc/Controller";
 
/**
 * @namespace com.ndbs.managementplaneui.util.session
 */
export default class UserAPI {
    private sourceController:Controller | UIComponent
    public avatar: string;
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
                    this.firstName = user.firstname as string;
                    this.lastName = user.lastname as string;
                    this.email = user.email as string;
                    this.avatar = user.firstname.substring(0, 1) + user.lastname.substring(0, 1);
                    resolve(user);
                }
            });
        });
    }
}