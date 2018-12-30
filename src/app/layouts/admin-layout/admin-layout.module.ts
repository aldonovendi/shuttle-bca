import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard-template/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { AddBookingComponent } from '../../add-booking/add-booking.component';
import { ScheduleComponent } from '../../schedule/schedule.component';
import { ShuttlePointsAdminComponent } from '../../shuttle-points-admin/shuttle-points-admin.component';
import { RegisterUserComponent } from '../../register-user/register-user.component';
import { BookingListComponent } from '../../booking-list/booking-list.component';
import { ChangePhoneNoComponent } from '../../change-phone-no/change-phone-no.component';
import { ChangeEmailComponent } from '../../change-email/change-email.component';
import { ChangePasswordComponent } from '../../change-password/change-password.component';
import { AddBookingAdminComponent } from '../../add-booking-admin/add-booking-admin.component';
import { AddShuttlePointComponent } from '../../add-shuttle-point/add-shuttle-point.component';
import { BookingReportComponent } from '../../booking-report/booking-report.component';
import { ManageUserComponent } from '../../manage-user/manage-user.component';
import { ReportComponent } from '../../report/report.component';
import { DownloadReportComponent } from '../../download-report/download-report.component';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { AdminDashboardComponent } from '../../admin-dashboard/admin-dashboard.component';
import { EditShuttlePointComponent } from '../../edit-shuttle-point/edit-shuttle-point.component';

import { environment } from '../../../environments/environment'
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ExcelService } from '../../services/excel.service';
import { HttpClientModule } from '@angular/common/http';
// import { ToastrService } from 'ngx-toastr';
// import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatTooltipModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTreeModule,
} from '@angular/material';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTreeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDncE22SW0ALZq1cuovqN0sPTLwcyoxdnU'
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgxSpinnerModule
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    EditShuttlePointComponent,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    AddBookingComponent,
    ScheduleComponent,
    ShuttlePointsAdminComponent,
    RegisterUserComponent,
    BookingListComponent,
    ChangePhoneNoComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    AddBookingAdminComponent,
    AddShuttlePointComponent,
    BookingReportComponent,
    ManageUserComponent,
    ReportComponent,
    DownloadReportComponent,
    ConfirmationDialogComponent,
    AdminDashboardComponent,
    EditShuttlePointComponent,
  ],
  providers:[ExcelService]
})

export class AdminLayoutModule {}
