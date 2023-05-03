import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../CommonService/AuthGuard';
import { LayoutModule } from '../theme/layouts/layout.module';
import { AppComponent } from '../app.component';
import { CompanyComponent } from './Module/company/company.component';
import { CookieService } from 'ngx-cookie-service';
import { DashboardMenuService } from '../CommonService/DashboardMenuService';
import { ChangepasswordComponent } from './Module/changepassword/changepassword.component';

import { CreatepasswordComponent } from './Module/createpassword/createpassword.component';
import { SetupDashboardComponent } from './Module/setup/SetupDashboard/SetupDashboardComponent';
import { ReportComponentForm } from '../theme/Module/Reports/ReportComponentForm';
import { DashboardForm } from '../theme/Module/Dashboard/DashboardForm';
import { PasswordchangedComponent } from '../Module/account/passwordchanged/passwordchanged.component';
import { PageListComponent } from '../CommonComponent/PageList/PageListComponent';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatStepperModule } from '@angular/material';
import { MatInputModule, MatAutocompleteModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MyDatePickerModule } from 'mydatepicker';
import { CommonModule } from '@angular/common';
import { CommonUtilsModule } from '../common/common-utils.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { NgxPrintModule } from 'ngx-print';
import { NgxEchartsModule } from 'ngx-echarts';
import { MakeComponentList } from '../theme/Module/setup/Make/MakeComponentList';
import { CategoryComponentList } from '../theme/Module/setup/Category/CategoryComponentList';

import { VehicleComponentList } from '../theme/Module/setup/Vehicle/VehicleComponentList';
import { VehicleComponentForm } from '../theme/Module/setup/Vehicle/VehicleComponentForm';

import { ContentComponentList } from '../theme/Module/setup/ContentManagment/ContentComponentList';
import { ContectComponentForm } from '../theme/Module/setup/ContentManagment/ContentComponentForm';

import { VehicleModelComponentList } from '../theme/Module/setup/VehicleModel/VehicleModelComponentList';


const SecureRoutes: Routes = [
   {
        'path': '',
        'component': ThemeComponent,
        'canActivate': [AuthGuard],
        children: [
            { path: 'company', component: CompanyComponent, canActivate: [AuthGuard] },
            { path: 'changepassword', component: ChangepasswordComponent, canActivate: [AuthGuard] },
            { path: 'createpassword', component: CreatepasswordComponent, canActivate: [AuthGuard] },
            { path: 'passwordchange', component: PasswordchangedComponent, canActivate: [AuthGuard] },
            { path: 'setup', component: SetupDashboardComponent, canActivate: [AuthGuard] },
            { path: 'dashboard', component: DashboardForm, canActivate: [AuthGuard] },
            { path: 'Make', component: MakeComponentList, canActivate: [AuthGuard] },
            { path: 'Category', component: CategoryComponentList, canActivate: [AuthGuard] },            
            { path: 'Vehicle', component: VehicleComponentList, canActivate: [AuthGuard] },
            { path: 'Vehicle/addVehicle:id', component: VehicleComponentForm, canActivate: [AuthGuard]},
            { path: 'Vehicle/addVehicle', component: VehicleComponentForm, canActivate: [AuthGuard] },   
            { path: 'Content', component: ContentComponentList, canActivate: [AuthGuard] },
            { path: 'Content/addContent:id', component: ContectComponentForm, canActivate: [AuthGuard]},
            { path: 'Content/addContent', component: ContectComponentForm, canActivate: [AuthGuard] },   
            { path: 'VehicleModel', component: VehicleModelComponentList, canActivate: [AuthGuard] },
            { path: 'dashboard', component: DashboardForm, canActivate: [AuthGuard] },  
            { path: 'report', component: ReportComponentForm, canActivate: [AuthGuard] },                   
        ],
    },
    {
        'path': '**',
        'redirectTo': 'login',
        'pathMatch': 'full',
    },
];
export const SecureComponent: any[] = [
    PasswordchangedComponent,
    CompanyComponent,  
    ChangepasswordComponent, 
    ContentComponentList,
    ContectComponentForm,
    CreatepasswordComponent,
    SetupDashboardComponent,
    ReportComponentForm,
    DashboardForm,
    PageListComponent,
    MakeComponentList,
    VehicleComponentList,
    VehicleModelComponentList,
    VehicleComponentForm,
    CategoryComponentList,
];
@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, LayoutModule, RouterModule.forChild(SecureRoutes), MatStepperModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatCheckboxModule
        , MatSelectModule, MatIconModule, MatDialogModule, MatTableModule, MatPaginatorModule, MatSortModule, MyDatePickerModule, NgbModule, MultiselectDropdownModule, NgxEchartsModule, NgxPrintModule/*,MultiselectDropdownModule, NgxEchartsModule*/
        , CommonUtilsModule],
    exports: [RouterModule],
    declarations: [
        SecureComponent //DatetimePickerComponent, DialogboxComponent
    ],
    bootstrap: [],
    providers: [CookieService, AuthGuard, DashboardMenuService]
})
export class ThemeRoutingModule { }