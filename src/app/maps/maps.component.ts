import { Component, OnInit } from '@angular/core';

declare const google: any;

interface Marker {
    lat: number;
    lng: number;
    label?: string;
    draggable?: boolean;
}

export const SHUTTLE_POINTS = [
    { name: "Alam Sutera", lat: 0, lng: 0, img: "../assets/img/sidebar-1.jpg" },
    { name: "BCA Learning Institute", lat: -6.5852544, lng: 106.8823999, img: "../assets/img/maps/bca-learning-institute.jpg" },
    { name: "Bekasi", lat: -6.248678, lng: 106.993041, img: "../assets/img/maps/bekasi.jpg" },
    { name: "Bogor", lat: 0, lng: 0, img: "../assets/img/sidebar-4.jpg" },
    { name: "Kelapa Gading", lat: -6.169227, lng: 106.900269, img: "../assets/img/maps/kelapa-gading.jpg" },
    { name: "Pondok Indah", lat: 0, lng: 0, img: "../assets/img/sidebar-4.jpg" },
    { name: "Wisma Asia", lat: -6.189851, lng: 106.79775, img: "../assets/img/maps/wisma-asia.jpg" },
]

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
    zoom: number = 20;

    constructor() { }

    shuttlePoints = SHUTTLE_POINTS;

    ngOnInit() {

        // var myLatlng = new google.maps.LatLng(-6.189450, 106.800990);
        // var mapOptions = {
        //     zoom: 13,
        //     center: myLatlng,
        //     scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
        //     styles: [{
        //         "featureType": "water",
        //         "stylers": [{
        //             "saturation": 43
        //         }, {
        //             "lightness": -11
        //         }, {
        //             "hue": "#0088ff"
        //         }]
        //     }, {
        //         "featureType": "road",
        //         "elementType": "geometry.fill",
        //         "stylers": [{
        //             "hue": "#ff0000"
        //         }, {
        //             "saturation": -100
        //         }, {
        //             "lightness": 99
        //         }]
        //     }, {
        //         "featureType": "road",
        //         "elementType": "geometry.stroke",
        //         "stylers": [{
        //             "color": "#808080"
        //         }, {
        //             "lightness": 54
        //         }]
        //     }, {
        //         "featureType": "landscape.man_made",
        //         "elementType": "geometry.fill",
        //         "stylers": [{
        //             "color": "#ece2d9"
        //         }]
        //     }, {
        //         "featureType": "poi.park",
        //         "elementType": "geometry.fill",
        //         "stylers": [{
        //             "color": "#ccdca1"
        //         }]
        //     }, {
        //         "featureType": "road",
        //         "elementType": "labels.text.fill",
        //         "stylers": [{
        //             "color": "#767676"
        //         }]
        //     }, {
        //         "featureType": "road",
        //         "elementType": "labels.text.stroke",
        //         "stylers": [{
        //             "color": "#ffffff"
        //         }]
        //     }, {
        //         "featureType": "poi",
        //         "stylers": [{
        //             "visibility": "off"
        //         }]
        //     }, {
        //         "featureType": "landscape.natural",
        //         "elementType": "geometry.fill",
        //         "stylers": [{
        //             "visibility": "on"
        //         }, {
        //             "color": "#b8cb93"
        //         }]
        //     }, {
        //         "featureType": "poi.park",
        //         "stylers": [{
        //             "visibility": "on"
        //         }]
        //     }, {
        //         "featureType": "poi.sports_complex",
        //         "stylers": [{
        //             "visibility": "on"
        //         }]
        //     }, {
        //         "featureType": "poi.medical",
        //         "stylers": [{
        //             "visibility": "on"
        //         }]
        //     }, {
        //         "featureType": "poi.business",
        //         "stylers": [{
        //             "visibility": "simplified"
        //         }]
        //     }]

        // };
        // var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // var marker = new google.maps.Marker({
        //     position: myLatlng,
        //     title: "Hello World!"
        // });

        // // To add the marker to the map, call setMap();
        // marker.setMap(map);
    }

}
