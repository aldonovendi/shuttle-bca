import { Routes } from '@angular/router';

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
import { RegisterUserComponent } from '../../register-user/register-user.component'
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
import { AdminDashboardComponent } from '../../admin-dashboard/admin-dashboard.component';
import { EditShuttlePointComponent } from '../../edit-shuttle-point/edit-shuttle-point.component';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    // { path: 'dashboard',      component: DashboardComponent },
    // { path: 'user-profile',   component: UserProfileComponent },
    // { path: 'table-list',     component: TableListComponent },
    // { path: 'typography',     component: TypographyComponent },
    // { path: 'icons',          component: IconsComponent },
    // { path: 'maps',           component: MapsComponent },
    // { path: 'notifications',  component: NotificationsComponent },
    // { path: 'upgrade',        component: UpgradeComponent },
    { path: 'add-booking',        component: AddBookingComponent },
    { path: 'shuttle-points', component: ScheduleComponent},
    { path: 'shuttle-points-admin', component: ShuttlePointsAdminComponent},
    { path: 'register-user', component: RegisterUserComponent},
    { path: 'booking-list', component: BookingListComponent},
    { path: 'change-email', component: ChangeEmailComponent},
    { path: 'change-phone-no', component: ChangePhoneNoComponent},
    { path: 'change-password', component: ChangePasswordComponent},
    { path: 'add-booking-admin', component: AddBookingAdminComponent},
    { path: 'add-shuttle-point', component: AddShuttlePointComponent},
    { path: 'booking-report', component: BookingReportComponent},
    { path: 'manage-user', component: ManageUserComponent},
    { path: 'download-booking-report/:month/:year', component: ReportComponent },
    { path: 'download-report', component: DownloadReportComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent },
];
