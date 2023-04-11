﻿import { Injectable } from '@angular/core';
import { HMSScreen } from '../AngularConfig/global'
import { ActivatedRoute, CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonService } from '../CommonService/CommonService'
import { LoaderService } from '../CommonService/LoaderService';
import { EncryptionService } from '../CommonService/encryption.service';
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private encrypt: EncryptionService, private ARoute: ActivatedRoute, private _commonService: CommonService, private loader: LoaderService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._commonService.Tokenvalidate() == true) {
            var CurrentCompName = state.url.split('/')[1].toString();
            var routeName = state.url.toString();
           if (this.IsScreenAllow(routeName) == true)
                return true;
            else {
                debugger
                this.loader.HideLoader();
                this.router.navigate(['/login']);
                return false;
            }
        }

        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }

    public IsScreenAllow(routeName: string): boolean {
        routeName = routeName.split("?")[0];
        //var ScreenRights = JSON.parse(this.encrypt.decryptionAES(localStorage.getItem("Rights")));

        // var RouthFind = HMSScreen.filter(f => f.text == routeName)

        // if (RouthFind.length == 0)
        //     return true;

        // var ScreenID = RouthFind[0].id;

        //if (ScreenRights.filter(f => f == ScreenID).length > 0)
            return true;
        // else
        //     return false;
    }
}