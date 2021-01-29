import { Component, OnInit } from '@angular/core';
// import { AppPage } from 'e2e/src/app.po';

declare let google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  autocomplete: any;
  formattedAddress: string;
  address: string = '';
  country:string = '';
  postal:string = '';
  landmark:string = '';
  lat = 51.678418;
  lng = 7.809007;
  query:string = '';
  manual = false;
  currentLocation:any;
 

  constructor() {
  }

  // handleAddressChange(address: any) {

  //   this.formattedAddress = address.formatted_address;
  

  //   this.lat = address.geometry.location.lat();
  //   this.lng = address.geometry.location.lng();
  //   console.log("address", address);

  // }


   mapReadyHandler(e: any){

  //  console.log("map details",e)
    this.lat = e.coords.lat;
      this.lng = e.coords.lng;
      this.manual = true;
      // this.initMap();

      // let geocoder = new google.maps.Geocoder;  
      //               let latlng = {  
      //                   lat: this.lat,  
      //                   lng: this.lng  
      //               };  
      //               geocoder.geocode({  
      //                   'location': latlng  
      //               }, (results)=>{  
      //                   if (results[0]) {  
      //                       this.currentLocation = results[0].formatted_address;  
      //                       console.log("this.locs",this.currentLocation);  
      //                   } else {  
      //                       console.log('Not found');  
      //                   }  
      //                 });
  }


//New Functionality

map:any;
service:any;
infowindow:any;


async initMap() {
  if(!this.manual){
    const place = new google.maps.LatLng(this.lat, this.lng);
    // console.log("query", this.query)
    this.infowindow = new google.maps.InfoWindow();
    this.map = new google.maps.Map(document.getElementById("map"));
  
    const request = {
      query: this.query,
      fields: ["name", "geometry"],
    };
  
    this.service = new google.maps.places.PlacesService(this.map);
    await this.service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // for (let i = 0; i < results.length; i++) {
        //   this.createMarker(results[i]);
        // }
        // this.map.setCenter(results[0].geometry.location);
        console.log("place details", results[0].geometry.location);
        let loc = results[0].geometry.location;
        this.lat = loc.lat();
        this.lng = loc.lng();
        console.log("lattitude", loc.lat());
        console.log("longitude", loc.lng());
      }
    });
  }
 

//  const geocoder = new google.maps.Geocoder();
// 		geocoder.geocode({
// 			"address" : 'USA'
// 		}, function(results, status) {
// 			if(status == google.maps.GeocoderStatus.OK) {
// 				// $("#lat").val(results[0].geometry.location.lat().toFixed(6));
//         // $("#lng").val(results[0].geometry.location.lng().toFixed(6));
//         console.log("locs", results[0].geometry.location);
// 			} else {
// 				alert("Please enter correct place name");
// 			}
// 		});
// 		return false;
}

// reverseGeocode(){
//   // function initMap() {
//     const map = new google.maps.Map(document.getElementById("map"), {
//       zoom: 8,
//       center: { lat: 40.731, lng: -73.997 },
//     });
//     const geocoder = new google.maps.Geocoder();
//     const infowindow = new google.maps.InfoWindow();
//     document.getElementById("submit").addEventListener("click", () => {
//       geocodeLatLng(geocoder, map, infowindow);
//     });
//   // }
  
//   // function geocodeLatLng(geocoder, map, infowindow) {
//   //   const input = document.getElementById("latlng").value;
//   //   const latlngStr = input.split(",", 2);
//     const latlng = {
//       lat: parseFloat(latlngStr[0]),
//       lng: parseFloat(latlngStr[1]),
//     };
//     geocoder.geocode({ location: latlng }, (results, status) => {
//       if (status === "OK") {
//         if (results[0]) {
//           map.setZoom(11);
//           const marker = new google.maps.Marker({
//             position: latlng,
//             map: map,
//           });
//           infowindow.setContent(results[0].formatted_address);
//           infowindow.open(map, marker);
//         } else {
//           window.alert("No results found");
//         }
//       } else {
//         window.alert("Geocoder failed due to: " + status);
//       }
//     });
//   // }
// }


ngOnInit() {
  // this.initMap();
  // this.reverseGeocode();
}

makeQuery(id){
  console.log("test");
  console.log("coutry", this.country)
  let newQuery = '';
  // switch(id){
  //   case 1: newQuery = t;
  //   break;
  //   case 2: this.query = this.query.concat(this.country);
  //   break;
  //   case 3: this.query = this.query.concat(this.postal);
  //   break;
  //   case 4: this.query = this.query.concat(this.address)
     
  // }
  // this.query=newQuery;
  // console.log("address", this.address)
  this.query = `${this.address},${this.country},${this.postal},${this.landmark}`;
  console.log("final",this.query);
  this.initMap();
}

//  createMarker(place) {
//   const marker = new google.maps.Marker({
//     map:this.map,
//     position: place.geometry.location,
//   });
//   google.maps.event.addListener(marker, "click", () => {
//     this.infowindow.setContent(place.name);
//     this.infowindow.open(this.map);
//   });
// }

 
}
