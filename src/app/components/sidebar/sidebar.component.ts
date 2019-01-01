import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    // { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/add-booking', title: 'Add Booking',  icon:'add', class: '' },
    { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: '/shuttle-points', title: 'Shuttle Points',  icon:'location_on', class: '' },
    { path: '/shuttle-points-admin', title: 'Shuttle Points Admin',  icon:'location_on', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/booking-list', title: 'My Booking History',  icon:'history', class: '' },
    { path: '/register-user', title: 'Register User',  icon:'person_add', class: '' },
    { path: '/add-booking-admin', title: 'Add Booking to User',  icon:'add_circle', class: '' },
    { path: '/add-shuttle-point', title: 'Add Shuttle Point',  icon:'add_location', class: '' },
    { path: '/booking-report', title: 'Booking Report',  icon:'library_books', class: '' },
    { path: '/download-report', title: 'Download Report',  icon:'save_alt', class: '' },
    { path: '/manage-user', title: 'Manage User',  icon:'people', class: '' },
    { path: '/admin-dashboard', title: 'Admin Dashboard',  icon:'dashboard', class: '' },

    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
