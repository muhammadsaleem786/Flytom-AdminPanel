import { Component, Input, Output, OnInit, OnChanges, EventEmitter,TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ContentModel,BannerList } from '../ContentManagment/ContentModel';
import { ContentService } from '../ContentManagment/ContentService';
import { LoaderService } from '../../../../CommonService/LoaderService';
import { ValidationVariables } from '../../../../AngularConfig/global';
import { CommonService } from '../../../../CommonService/CommonService';
import { EncryptionService } from '../../../../CommonService/encryption.service';
import { CommonToastrService } from '../../../../CommonService/CommonToastrService';
import { IMyDateModel } from 'mydatepicker';
import { GlobalVariable } from '../../../../AngularConfig/global';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { forEach } from '@angular/router/src/utils/collection';
import { FileService } from '../../../../CommonService/FileService';
const noop = () => {
};
@Component({
    selector: 'setup-ExpenseComponentForm',
    templateUrl: './ContectComponentForm.html',
    moduleId: module.id,
    providers: [ContentService,FileService],
})
export class ContectComponentForm implements OnInit {
    public Form1: FormGroup;
    public submitted: boolean;
    @Input() ScreenName: string;
    @Input() id: number;
    public IsShowRange:boolean=false;
    public IsReadOnly = false;
    public filterdData = [];
    public IsAdmin: boolean = false;
    public IsUpdateText: boolean = false;
    public model = new ContentModel();
    public PayrollRegion: string;
   // public BannerListModel=new BannerList();
    public ImageList:any[]=[];
    public ContentList:any[]=[];
    public Keywords: any[] = [];
    public Attachment:any;
    public sub: any;
    public IsEdit: boolean = false;
    public AttachImage: string = '';
    public IsNewImage: boolean = true;
    public Bannar_dynamicArray = [];
    public max: number = 0;
    public count: number = 0;
    public percentage: number = 0;
    public imagedata: string = '';
    public showbar: boolean = false;
    public size: number;
    private innerValue: any = '';
    private selectedFiles: File[] = [];
    @Input() ImageWithAddress = false;
    private onChangeCallback: (_: any) => void = noop;

    constructor(public _CommonService: CommonService, private encrypt: EncryptionService,public _fb: FormBuilder, public loader: LoaderService
        ,private modalService: NgbModal, public _ContentService: ContentService, public commonservice: CommonService
        , public toastr: CommonToastrService, public route: ActivatedRoute, public _router: Router,private http: FileService) {
      }
    ngOnInit() {
        this.loadDropdown();
        this.Form1 = this._fb.group({
            ContentTypeId: ['', [Validators.required]],
            ContentDescription: ['', [Validators.required]],
            IsActive: [''],

        });
        this.sub = this.route.queryParams
            .pipe(filter(params => params.id))
            .subscribe(params => {
                this.id = params.id;
                if (this.id > 0) {
                    this.loader.ShowLoader();
                    this.IsEdit = true;
                    this._ContentService.GetById(this.id).then(m => {
                        debugger
                        var typeid=m.Data.ContentTypeId.toString();
                        this.model = m.Data;  
                        this.model.ContentTypeId=typeid;
                        this.Bannar_dynamicArray=[];
                       if (this.model.BannerList != null || this.model.BannerList != undefined) {
                       this.model.BannerList.forEach((item, index) => {
                        let obj=new BannerList();
                        obj.Id=item.Id;
                        obj.BannerTitle=item.BannerTitle;
                        obj.BannerDescription=item.BannerDescription;
                        obj.BannerImageUrl=item.BannerImageUrl;
                             this.Bannar_dynamicArray.push(obj); 
                         });  
                        }          
                        this.loader.HideLoader();
                    },error =>{
                        var result = JSON.parse(error._body);
                                this.toastr.Error('Error', result.ResultSet.ErrorMessage);
            
                        console.log(error);
                    });
                } else {
                    
                    this.loader.HideLoader();
                }
            });
    }
    loadDropdown() {
        this.loader.ShowLoader();
        this._ContentService.FormLoad().then(m => {
            if (m.IsSuccess) {    
                this.ContentList = m.ResultSet.ContentList;
                this.loader.HideLoader();
            } else
                this.loader.HideLoader();
        },error =>{
            
            console.log(error);
        });
    }
    RemoveRow(rowno: any) {
        if (this.Bannar_dynamicArray.length > 1) {
            this.Bannar_dynamicArray.splice(rowno, 1);
        }
    }
    AddBannar() {debugger
        var obj = new BannerList();
        obj.Id=0;
        this.Bannar_dynamicArray.push(obj);
        this.loader.HideLoader();
    }
    SaveOrUpdate(isValid: boolean): void {
        this.submitted = true; // set form submit to true
        if (isValid) {
            this.submitted = false;
            this.loader.ShowLoader();
         
            this.model.BannerList=this.Bannar_dynamicArray.filter(a => a.BannerTitle != null);
            this.model.IsActive=true;
            this._ContentService.SaveOrUpdate(this.model).then(m => {
                var result = JSON.parse(m._body);
                if (result.IsSuccess) {
                    this.toastr.Success(result.Message);
                    this._router.navigate(['home/Content']);
                    this.loader.HideLoader();
                }
                else {
                    this.toastr.Error('Error', result.ErrorMessage);
                    this.loader.HideLoader();
                }
            },error =>{
                var result = JSON.parse(error._body);
                        this.toastr.Error('Error', result.ResultSet.ErrorMessage);
    
                console.log(error);
            });
        }
    }
    fileChangeEvent(data: any,i:any): void {
        var self = this;
        self.size = data.target.files[0].size;
        self.size = self.size / 1024;
        self.size = self.size / 1024;
        self.size = Math.round(self.size * 100) / 100
        if (self.size > 2) {
            self.imagedata = 'File size is greater than 2 MB. File size is ' + self.size + ' MB';
            self.value = '';
            return;
        }
        else {
            self.showbar = true;
            self.imagedata = 'File size is ' + self.size + ' MB';
            self.selectedFiles = data.target.files;
            if (self.selectedFiles.length == 0) return;
            self.max = 100;
            self.percentage = 0;
            self.http.Upload(self, self.selectedFiles, self.tempFunction).then(res => {
                    var result = JSON.parse(JSON.stringify(res));
                    if (result.IsSuccess == true) {
                        if (result.Data.length == 1){
                            if (self.ImageWithAddress == true) {
                                self.value = result.Data;

                            }
                            else {
                                self.value = result.Data
                                this.Bannar_dynamicArray[i].BannerImageUrl= GlobalVariable.BASE_Temp_File_URL + '' + result.Data[0].Image;
                            }
                        }
                           
                        else {
                            self.value = result.Data
                        }
                    }
                },
                error => error
            );
        }

        self.value = '';
        self.innerValue = '';
    }
    tempFunction(self: any, value: number) {
        self.percentage = value
    }
     //get accessor
     get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }
    Delete() {
        var result = confirm("Are you sure you want to delete selected record.");
        if (result) {
            this.loader.ShowLoader();
            this._ContentService.Delete(this.model.Id.toString()).then(m => {
                if (m.ErrorMessage != null)
                    this.toastr.Error('Error', m.ErrorMessage);
                else
                    this._router.navigate(['/home/Expense']);
                this.loader.HideLoader();
            });
        }
    }
    Close() {
        this.model = new ContentModel();
        this.submitted = false;
    }
}
