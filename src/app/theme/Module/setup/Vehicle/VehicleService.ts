﻿import { Injectable } from '@angular/core';
import { GlobalVariable } from '../../../../AngularConfig/global';
import { HttpService } from '../../../../CommonService/HttpService';
import { VehicleModel } from './VehicleModel';
@Injectable()
export class VehicleService {
    private urlToApi = GlobalVariable.BASE_Api_URL + "/AdminCarRent"
    constructor(private http: HttpService) { }

     GetList(CurrentPage: number, RecordPerPage: number, VisibleColumnInfo: string, SortName: string, SortOrder: string, SearchText: string): Promise<any> {
        var data = { 'CurrentPageNo': CurrentPage, 'RecordPerPage': RecordPerPage, 'VisibleColumnInfo': VisibleColumnInfo, 'SortName': SortName, 'SortOrder': SortOrder, 'SearchText': SearchText, 'IgnorePaging': false };
        return this.http.Get(this.urlToApi + '/GetVehicleList', data).then(e => e);
    }

    ExportData(ExportType: number, CurrentPage: number, RecordPerPage: number, VisibleColumnInfo: string, SortName: string, SortOrder: string, SearchText: string): Promise<any> {
        var data = { 'ExportType': ExportType, 'CurrentPageNo': CurrentPage, 'RecordPerPage': RecordPerPage, 'VisibleColumnInfo': VisibleColumnInfo, 'SortName': SortName, 'SortOrder': SortOrder, 'SearchText': SearchText, 'IgnorePaging': true };
        return this.http.Get(this.urlToApi + '/ExportData', data).then(e => {
            if (e.FilePath != "")
                this.http.ExportDataDownload(GlobalVariable.BASE_Api_URL, e.FilePath);
            return e;
        });
    }

    GetById(Id: any): Promise<any> {
        var data = { 'Id': Id };
        return this.http.Get(this.urlToApi + '/GetVehicleById', data).then(e => e);
    }

    SaveOrUpdate(entity: VehicleModel): Promise<any> {
    
            return this.http.Post(this.urlToApi + '/VehicleAddUpdate', entity).then(e => e);
    
    }
    Delete(Id: string): Promise<any> {
        var data = { 'Id': Id };
        return this.http.Delete(this.urlToApi + '/VehicleDelete', data).then(e => e);
    }
    FormLoad(): Promise<any> {
        return this.http.Get(this.urlToApi + '/GetSysDropdown', {}).then(e => e);
    }
    GetAllScreens(): Promise<any> {
        return this.http.Get(this.urlToApi + '/GetAllScreens', {}).then(e => e);
    }
    LoadModelByMakeId(Id: any): Promise<any> {
        var data = { 'Id': Id };
        return this.http.Get(this.urlToApi + '/LoadModelByMakeId', data).then(e => e);
    }
    UploadImage(formData: any): Promise<any> {
        return this.http.Post(this.urlToApi + '/UploadImage', formData).then(e => e);
    }
    
}
