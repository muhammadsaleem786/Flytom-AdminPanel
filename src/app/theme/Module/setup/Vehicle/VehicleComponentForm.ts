import { Component, Input, Output, OnInit, OnChanges, EventEmitter,TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { VehicleModel,VehicleImage,VehiclePartRequest } from './VehicleModel';
import { MakeModel } from './../Make/MakeModel';
import { MakeService } from './../Make/MakeService';

import { Vehicle } from './../VehicleModel/Vehicle';
import { VehicleModelService } from './../VehicleModel/VehicleModelService';


import { LoaderService } from '../../../../CommonService/LoaderService';
import { VehicleService } from './VehicleService';
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
@Component({
    selector: 'setup-ExpenseComponentForm',
    templateUrl: './VehicleComponentForm.html',
    moduleId: module.id,
    providers: [VehicleService,MakeService,VehicleModelService],
})
export class VehicleComponentForm implements OnInit {
    public Form1: FormGroup;
    public Form2: FormGroup;
    public Form3: FormGroup;
    public submitted: boolean;
    @Input() ScreenName: string;
    public Makemodel = new MakeModel();
    public vehicletable = new Vehicle();
    @Input() id: number;
    public IsShowRange:boolean=false;
    public IsReadOnly = false;
    public filterdData = [];
    public IsAdmin: boolean = false;
    public IsUpdateText: boolean = false;
    public model = new VehicleModel();
    public VehicleImage=new VehicleImage();
    public VehiclePartModel = new VehiclePartRequest();
    public PayrollRegion: string;
    public ModelList: any[] = [];
    public MakeList: any[] = [];
    public FuelTypeList: any[] = [];
    public SteeringTypeList: any[] = [];
    public PCategoryList:any[]=[];
    public VCategoryList:any[]=[];
public DriveWheelTypeList:any[]=[];
public SeatList:any[]=[];
public SequreFeetList:any[]=[];
public LicenceTypeList:any[]=[];
    public ImageList:any[]=[];
    public Keywords: any[] = [];
    public selectedFiles: FileList;
    public Attachment:any;
    public sub: any;
    public IsEdit: boolean = false;
    public AttachImage: string = '';
    public IsNewImage: boolean = true;
    public VehiclePart_Request_dynamicArray = [];
    @ViewChild("MakeModal") ModelContent: TemplateRef<any>;
    @ViewChild("VehicleModal") VehicleModelContent: TemplateRef<any>;
    constructor(public _CommonService: CommonService, private encrypt: EncryptionService,public _fb: FormBuilder, public loader: LoaderService
        ,private modalService: NgbModal,public _VehicleModelService:VehicleModelService,public _MakeService:MakeService, public _VehicleService: VehicleService, public commonservice: CommonService
        , public toastr: CommonToastrService, public route: ActivatedRoute, public _router: Router) {
      }
    ngOnInit() {
        this.loadDropdown();
        this.Form1 = this._fb.group({
            MakesId: ['', [Validators.required]],
            VehicleModelsId: ['', [Validators.required]],
            CarType: ['', [Validators.required]],
            TankCapacity: ['', [Validators.required]],
            NoOfDoor: ['', [Validators.required]],
            NoOfSeatId: ['', [Validators.required]],
            Description: ['', [Validators.required]],
            DriveWheelType: ['', [Validators.required]],
            SteeringTypeId: ['', [Validators.required]],
            CategoryId: ['', [Validators.required]],
            LicenceType: ['', [Validators.required]],
            SequreFeetId:[''],
            LoadCapacity:['', [Validators.required]],
            RangeGiven:[''],
            Lift:[''],
            FuelTypeId:['', [Validators.required]],
            Length:[''],
            Height:[''],
            Width:[''],

        });
        this.Form2 = this._fb.group({
            Name: ['', [Validators.required]],
        });
        this.Form3 = this._fb.group({
            Name: ['', [Validators.required]],
            MakeId: ['', [Validators.required]],
        });
        this.sub = this.route.queryParams
            .pipe(filter(params => params.id))
            .subscribe(params => {
                this.id = params.id;
                if (this.id > 0) {
                    this.loader.ShowLoader();
                    this.IsEdit = true;
                 this.VehiclePart_Request_dynamicArray=[];
                    this._VehicleService.GetById(this.id).then(m => {
                        this.model = m.Data;  
                        this.ModelList = this.ModelList.filter(a=>a.MakeId==this.model.MakesId);


                        this.VehiclePart_Request_dynamicArray.forEach((item, index) => {
                            debugger
                            var list = this.model.VehiclePartRequest.filter(a => a.DropDownId == item.DropDownId);
                                    if (list.length > 0 || item.IsChecked) {      
                                        this.VehiclePart_Request_dynamicArray[index].Id=list[0].Id;
                                        this.VehiclePart_Request_dynamicArray[index].IsChecked=list[0].IsChecked;

                                    } else{
                                        this.VehiclePart_Request_dynamicArray[index].Id=0;
                                    this.VehiclePart_Request_dynamicArray[index].IsChecked= false;
                                    }
                         });                         
                       if (this.model.VehicleImage != null || this.model.VehicleImage != undefined) {
                            this.getImageUrlName(this.model.VehicleImage);
                            this.IsNewImage = false;
                        } else this.IsNewImage = true;                
                        this.loader.HideLoader();
                    },error =>{
                        debugger
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
        this.VehiclePart_Request_dynamicArray=[];
        this.loader.ShowLoader();
        this._VehicleService.FormLoad().then(m => {
            if (m.IsSuccess) {                
                this.MakeList = m.ResultSet.makeList;
                if(this.IsEdit)
                this.ModelList = m.ResultSet.ModelList;
                this.FuelTypeList = m.ResultSet.FuelTypeList;
                this.SteeringTypeList = m.ResultSet.SteeringTypeList;
                this.PCategoryList=m.ResultSet.PCategoryList;
                this.VCategoryList=m.ResultSet.VCategoryList;
this.DriveWheelTypeList=m.ResultSet.DriveWheelTypeList;
this.SeatList=m.ResultSet.SeatList;
this.LicenceTypeList=m.ResultSet.LicenceTypeList;
this.SequreFeetList=m.ResultSet.SequreFeetList;

m.ResultSet.PartList.forEach((item, index) => {
    item.DropDownId=item.ID;
            item.Name = item.Name;
            item.IsChecked=false;
        this.VehiclePart_Request_dynamicArray.push(item);
 });


                this.loader.HideLoader();
            } else
                this.loader.HideLoader();
        },error =>{
            
            console.log(error);
        });
    }
   
    checkValue(rowno:any,id: any,IsChecked:any) {   
        if(IsChecked){   
    this.VehiclePart_Request_dynamicArray[rowno].IsChecked = IsChecked;    
        }
    else{
    this.VehiclePart_Request_dynamicArray[rowno].IsChecked = IsChecked;
    }
    }
    LoadModelByMakeId(Id:any){
        this.loader.ShowLoader();
        this._VehicleService.LoadModelByMakeId(Id).then(m => {
            if (m.IsSuccess) {     
                this.ModelList = m.Data;
                //this.model.VehicleModelsId=this.ModelList;
                this.loader.HideLoader();
            } else
                this.loader.HideLoader();
        });
    }
    
    FuelTypeChange(Id:any){
      if(Id==3)
      this.IsShowRange=true;
      else
      this.IsShowRange=false;
    }
    openNewMakeModal(MakeModal) {
            this.loader.ShowLoader();
            this.Makemodel = new MakeModel();
            this.modalService.open(this.ModelContent, { size: 'md' });
            this.loader.HideLoader();      
    }
    MakeSaveOrUpdate(isValid: boolean): void {
        this.submitted = true; // set form submit to true
        if (isValid) {
            this.submitted = false;
            this.loader.ShowLoader();
            this._MakeService.SaveOrUpdate(this.Makemodel).then(m => {
                var result = JSON.parse(m._body);
                if (result.IsSuccess) {
                    this.loadDropdown();
                    this.loader.HideLoader();
                    this.toastr.Success(result.Message);
                    this.modalService.dismissAll(this.ModelContent);                  
                }
                else {
                    this.toastr.Error('Error', result.ErrorMessage);
                    this.loader.HideLoader();
                }
            });
        }
    }
    openNewVehicleModal(MakeModal) {
        this.loader.ShowLoader();
        this.vehicletable = new Vehicle();
        this.modalService.open(this.VehicleModelContent, { size: 'md' });
        this.loader.HideLoader();      
}
VehicleModelSaveOrUpdate(isValid: boolean): void {
    this.submitted = true; // set form submit to true
    if (isValid) {
        this.submitted = false;
        this.loader.ShowLoader();
        debugger
        this._VehicleModelService.SaveOrUpdate(this.vehicletable).then(m => {
            var result = JSON.parse(m._body);
            if (result.IsSuccess) {
                this.loadDropdown();
                this.loader.HideLoader();
                this.toastr.Success(result.Message);
                this.modalService.dismissAll(this.VehicleModelContent);                  
            }
            else {
                this.toastr.Error('Error', result.ErrorMessage);
                this.loader.HideLoader();
            }
        });
    }
}
    SaveOrUpdate(isValid: boolean): void {
        this.submitted = true; // set form submit to true
        if (isValid) {
            this.submitted = false;
            this.loader.ShowLoader();
            this.model.VehiclePartRequest = this.VehiclePart_Request_dynamicArray.filter(a=>a.IsChecked==true);
           if(this.model.SequreFeetId==undefined)
           this.model.SequreFeetId=null;
            this._VehicleService.SaveOrUpdate(this.model).then(m => {
                var result = JSON.parse(m._body);
                if (result.IsSuccess) {
                    this.toastr.Success(result.Message);
                    this._router.navigate(['home/Vehicle']);
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
  


    onInvoiceDateChanged(event: IMyDateModel) {
        if (event) {
        }
    }
    IsNewImageEvent(FName) {
        this.IsNewImage = true;
    }
    getFileName(FName) {
        this.Attachment = FName;
    }
    ClearImageUrl() {
        this.IsNewImage = true;
        this.Attachment = '';
        this.AttachImage = '';
        this.ImageList=[];
    }
    RemoveImage(rowno:any){
        if (this.ImageList.length > 1 && this.model.VehicleImage.length>0) {
            this.ImageList.splice(rowno, 1);
            this.model.VehicleImage.splice(rowno, 1);
        }

    }
    getImageUrlName(FName) {
        this.Attachment = FName;      

        if (this.IsEdit && !this.IsNewImage) {
            FName.forEach((item) => {
                let VehicleImage=this.VehicleImage;
                let AttachImage = GlobalVariable.BASE_Temp_File_URL + '' + item.Image;
                if(this.model.VehicleImage.filter(a=>a.Image==item.Image).length==0)
                {
                    this.model.VehicleImage.push({Id: item.id==undefined?0:item.id, Image: item.Image});

                    
                }
                this.ImageList.push(AttachImage);
                
              }); 
           
        } else {
            FName.forEach((item) => {
               
                let AttachImage = GlobalVariable.BASE_Temp_File_URL + '' + item.Image;
                if(this.model.VehicleImage.filter(a=>a.Image==item.Image).length==0)
                {
                this.model.VehicleImage.push({Id: item.id==undefined?0:item.id, Image: item.Image});
              
                }
               
                this.ImageList.push(AttachImage);
              }); 
        }
    }
    Delete() {
        var result = confirm("Are you sure you want to delete selected record.");
        if (result) {
            this.loader.ShowLoader();
            this._VehicleService.Delete(this.model.Id.toString()).then(m => {
                if (m.ErrorMessage != null)
                    this.toastr.Error('Error', m.ErrorMessage);
                else
                    this._router.navigate(['/home/Expense']);
                this.loader.HideLoader();
            });
        }
    }
    Close() {
        this.model = new VehicleModel();
        this.submitted = false;
    }
}
