import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ViewChild, ElementRef, HostListener, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { GlobalVariable } from '../../../AngularConfig/global';
import { HttpService } from '../../../CommonService/HttpService';
import { LoaderService } from '../../../CommonService/LoaderService';
import { DashboardService } from './DashboardService';
import { AsidebarService } from '../../../CommonService/AsidebarService';
import { CommonService } from '../../../CommonService/CommonService';
import { EncryptionService } from '../../../CommonService/encryption.service';
import { CommonToastrService } from '../../../CommonService/CommonToastrService';
import { DashboardModel } from './DashboardModel'
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ValidationVariables } from '../../../AngularConfig/global';
import { IMyDateModel } from 'mydatepicker';
import { ECharts } from 'echarts';
declare const require: any;
import { DatePipe } from '@angular/common';
declare var $: any;
@Component({
    selector: 'DashboardForm',
    templateUrl: './DashboardForm.html',
    moduleId: module.id,
    providers: [DashboardService, DatePipe]
})
export class DashboardForm {
    public Id: string;
    public IsList: boolean = true;
    public ID: number = 10;
    public model = new DashboardModel();
    public Rights: any;
    public Keywords: any[] = [];
    public PayrollRegion: string;
    public Currency: string;
    public DeshboardData: any = [];
    public AppointmentData: any = [];
    public BirthDayData: any = [];
    public BirthDayList: any = [];
    public FollowUpData: any = [];
    public Form2: FormGroup;
    public ScreenRights: any;
    public ColorArr = ['#b0d3fb', '#fdd4af', '#ace4da', '#e49aa3', '#ccc', '#daa8ff'];
    public PieColorArr = ['#5e54d0', '#D4D7DC'];
    public options: any;
    public IsCustomDate: boolean = false;
    public Male: any;
    public Female: any;
    public other: any;
    public Child: any;
    public TodayDate: any;
    public submitted: boolean;
    appointmentOption: any;
    public Step: number = 30;
    incomeANDexpense: any;
    public DoctorList: any[] = [];
    public StatusList: any[] = [];
    public IncomeList = [];
    public ExpenseList = [];
    public MonthList = [];
    public ServiceType: any;
    @ViewChild("longContent") ModelContent: TemplateRef<any>;
   
    constructor(public _fb: FormBuilder, private encrypt: EncryptionService, private datePipe: DatePipe, public toastr: CommonToastrService, private modalService: NgbModal, public _CommonService: CommonService, public _DashboardService: DashboardService, public loader: LoaderService
        , public _AsidebarService: AsidebarService, public _router: Router) {
        this.loader.ShowLoader();
       
        this.PayrollRegion = "PK";
    }
    ngOnInit() {
    }
  

    GoBack(DefaultRoute) {
        this._router.navigate([DefaultRoute]);
    }
    View(id: string) {
        this.loader.ShowLoader();
        this.Id = id;
        this.IsList = false;
    }
    GetList() {
        //this.Refresh();
    }
    Close(idpar) {
        this.IsList = true;
        if (idpar == 0)
            this.Id = '0';
        //else
        //this.Refresh();
        //this.SpecificPeriod = '';
        //this.ExportType = '';
    }
}
