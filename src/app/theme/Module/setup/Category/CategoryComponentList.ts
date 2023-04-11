import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {CategoryService } from './CategoryService';
import { CategoryModel } from './CategoryModel';
import { PaginationModel, PaginationConfig } from '../../../../CommonComponent/PaginationComponentConfig';
import { CommonService } from '../../../../CommonService/CommonService';
import { EncryptionService } from '../../../../CommonService/encryption.service';
import { LoaderService } from '../../../../CommonService/LoaderService';
import { CommonToastrService } from '../../../../CommonService/CommonToastrService';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
@Component({
    moduleId: module.id,
    templateUrl: 'CategoryComponentList.html',
    providers: [CategoryService],
})
export class CategoryComponentList {
    public ActiveToggle: boolean = false;
    public Id: string; public submitted: boolean;
    public PModel = new PaginationModel();
    public PConfig = new PaginationConfig();
    public ComplaintList: any[] = [];
    public IsList: boolean = true;
    public ID: number = 10; public model = new CategoryModel();
    public Rights: any;
    public Keywords: any[] = [];
    public Form1: FormGroup;
    public IsEdit: boolean = false;
    @ViewChild("CategoryModal") ModelContent: TemplateRef<any>;
    constructor(public _fb: FormBuilder, private encrypt: EncryptionService, private modalService: NgbModal,public _CommonService: CommonService, public loader: LoaderService, public _CategoryService:CategoryService,public _router: Router, public toastr: CommonToastrService,) {
        this.loader.ShowLoader();
    }
    ngOnInit() {
    this.Form1 = this._fb.group({
        Name: ['', [Validators.required]],
        CarType:['', [Validators.required]],
    });
        this.PConfig.PrimaryColumn = "ID";
        this.PConfig.ColumnVisibilityCookieName = "Calendar" + this.ID;
        this.PConfig.Action.ScreenName = 'Category';
        this.PConfig.Action.Add = true;
        this.PConfig.Fields = [
            { Name: "Name", Title: "Name", OrderNo: 1, SortingAllow: true, Visible: true, isDate: false, DateFormat: "" },
            { Name: "CreatedAt", Title: "Created", OrderNo: 2, SortingAllow: true, Visible: true, isDate: true, DateFormat: "" },
           
            
        ];
    }
    Refresh() {
        if (this.PModel.SearchText == '')
            this.loader.ShowLoader();
        this.Id = "0";
        this._CategoryService
            .GetList(this.PModel.CurrentPage, this.PModel.RecordPerPage, this.PModel.VisibleColumnInfo, this.PModel.SortName, this.PModel.SortOrder, this.PModel.SearchText).then(m => {

                this.PModel.TotalRecord = m.TotalItems;
                this.ComplaintList = m.Data;
                this.loader.HideLoader();
            });
    }

    AddRecord(id: string) {
        this.IsEdit = false;
        if (id != "0") {
            this.loader.ShowLoader();
            this._CategoryService.GetById(id).then(m => {
                if (m.Data != null) {
                    this.IsEdit = true;
                    this.model = m.Data;
                    this.modalService.open(this.ModelContent, { size: 'md' });
                }
                this.loader.HideLoader();
            });
        }
        else {
            this.loader.ShowLoader();
            this.model = new CategoryModel();
            this.modalService.open(this.ModelContent, { size: 'md' });
            this.loader.HideLoader();
        }
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
            this._CategoryService.SaveOrUpdate(this.model).then(m => {
                var result = JSON.parse(m._body);
                if (result.IsSuccess) {
                    this.toastr.Success(result.Message);
                    this.modalService.dismissAll(this.ModelContent);
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
            this._CategoryService.Delete(this.model.Id.toString()).then(m => {
                if (m.IsSuccess){
                    this.toastr.Success('Success', m.Message);
                this.modalService.dismissAll(this.ModelContent);
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
        this._CategoryService.ExportData(ExportType, this.PModel.CurrentPage, this.PModel.RecordPerPage, this.PModel.VisibleColumnInfo, this.PModel.SortName, this.PModel.SortOrder, this.PModel.SearchText).then(m => {
            this.loader.HideLoader();
        });
    }
}