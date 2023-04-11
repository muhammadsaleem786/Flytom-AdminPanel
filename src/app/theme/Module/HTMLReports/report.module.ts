import { NgModule } from '@angular/core';
import { ReportRoutingModule } from './report-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtilsModule } from '../../../common/common-utils.module';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from '../../../CommonService/AuthGuard';
import { DashboardMenuService } from '../../../CommonService/DashboardMenuService';

@NgModule({
    imports: [
        CommonUtilsModule, NgbModule, 
        ReportRoutingModule,
    ],
    declarations: [

    ],
    providers: [
        CookieService,
        AuthGuard,
        DashboardMenuService
    ]
})
export class ReportModule { }
