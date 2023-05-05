import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ContentService } from './ContentService';
import { ContentModel } from './ContentModel';
import { PaginationModel, PaginationConfig } from '../../../../CommonComponent/PaginationComponentConfig';
import { CommonService } from '../../../../CommonService/CommonService';
import { EncryptionService } from '../../../../CommonService/encryption.service';
import { LoaderService } from '../../../../CommonService/LoaderService';
import { CommonToastrService } from '../../../../CommonService/CommonToastrService';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
@Component({
    moduleId: module.id,
    templateUrl: 'ContentComponentList.html',
    providers: [ContentService],
})
export class ContentComponentList {
    public ActiveToggle: boolean = false;
    public Id: string; public submitted: boolean;
    public PModel = new PaginationModel();
    public PConfig = new PaginationConfig();
    public ContentList: any[] = [];
    public IsList: boolean = true;
    public ID: number = 10; public model = new ContentModel();
    public Rights: any;
    public Keywords: any[] = [];
    public Form1: FormGroup;
    public IsEdit: boolean = false;
    public ControlRights: any;
    constructor(public _fb: FormBuilder, private encrypt: EncryptionService, private modalService: NgbModal,public _CommonService: CommonService, public loader: LoaderService, public _ContentService:ContentService,public _router: Router, public toastr: CommonToastrService,) {
        this.loader.ShowLoader();
    }
    ngOnInit() {
   
        this.PConfig.PrimaryColumn = "ID";
        this.PConfig.ColumnVisibilityCookieName = "Calendar" + this.ID;
        this.PConfig.Action.ScreenName = 'Content Managment';
        this.PConfig.Action.Add = true;
        this.PConfig.Fields = [
            { Name: "ID", Title: "Id", OrderNo: 1, SortingAllow: true, Visible: true, isDate: false, DateFormat: "" },
            { Name: "Name", Title: "Name", OrderNo: 2, SortingAllow: true, Visible: true, isDate: false, DateFormat: "" },
            { Name: "IsActive", Title: "Status", OrderNo: 3, SortingAllow: true, Visible: true, isDate: false, DateFormat: "" },
            ];
    }

    AddRecord(id: string) {
        if (id != "0") {
            this.loader.ShowLoader();
            this._router.navigate(['home/Content/addContent']);
        }
        this.Id = id;
        this.IsList = false;
        this._router.navigate(['home/Content/addContent'], { queryParams: { id: this.Id } });
    }
    Refresh() {
        if (this.PModel.SearchText == '')
            this.loader.ShowLoader();
        this.Id = "0";
        this._ContentService
            .GetList(this.PModel.CurrentPage, this.PModel.RecordPerPage, this.PModel.VisibleColumnInfo, this.PModel.SortName, this.PModel.SortOrder, this.PModel.SearchText).then(m => {
                this.PModel.TotalRecord = m.TotalItems;
                this.ContentList = m.Data;
                this.loader.HideLoader();
            });
    }

 
    View(id: string) {
        this.loader.ShowLoader();
        this.Id = id;
        this.IsList = false;
    }
    SaveOrUpdate(isValid: boolean): void {
        this.submitted = true; // set form submit to true
        if (isValid) {
            this.submitted = false;
            this.loader.ShowLoader();
            this._ContentService.SaveOrUpdate(this.model).then(m => {
                var result = JSON.parse(m._body);
                if (result.IsSuccess) {
                    this.toastr.Success(result.Message);
                    this.GetList();
                }
                else {
                    this.toastr.Error('Error', result.ErrorMessage);
                    this.loader.HideLoader();
                }
            });
        }
    }
    Delete(id: string) {
        var result = confirm("Are you sure you want to delete selected record.");
        if (result) {
            this.loader.ShowLoader();
            this._ContentService.Delete(this.model.ID.toString()).then(m => {
                if (m.IsSuccess){
                    this.toastr.Success('Success', m.Message);
                    this.GetList();
                }                    
                else {
                    this.toastr.Error('Error', m.Message);
                }
                this.loader.HideLoader();
            });
        }
    }
    GetList() {
        this.Refresh();
    }
    Close(idpar) {
        this.IsList = true;
        if (idpar == 0)
            this.Id = '0';
        else
            this.Refresh();
    } 
    GoBack(DefaultRoute) {
        this._router.navigate([DefaultRoute]);
    }
    ExportData(ExportType: number) {
        this.loader.ShowLoader();
        this._ContentService.ExportData(ExportType, this.PModel.CurrentPage, this.PModel.RecordPerPage, this.PModel.VisibleColumnInfo, this.PModel.SortName, this.PModel.SortOrder, this.PModel.SearchText).then(m => {
            this.loader.HideLoader();
        });
    }
}