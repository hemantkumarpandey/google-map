import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


declare let google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  private subject: Subject<string> = new Subject();
  @ViewChild('gmap', {static: true}) gmapElement: any;

  autocomplete: any;
  formattedAddress: string;
  address: string = '';
  country: string = '';
  postal: string = '';
  landmark: string = '';
  lat = 51.678418;
  lng = 7.809007;
  query: string = 'India';
  manual = false;
  currentLocation: any;





  ngOnInit() {
    
    this.subject.pipe(debounceTime(700)).subscribe(data => {
      this.query = data;
      this.initMap();
    });
  }

  ngAfterViewInit(){
    // this.initializeMap();
  }

  initializeMap(){
    const lngLat = new google.maps.LatLng(6.5874964, 3.9886097);
    const mapOptions = {
      center: lngLat,
      zoom: 15,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false
    };


    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);
        const request = {
        query: this.query,
        fields: ["name", "geometry"],
      };
    this.service = new google.maps.places.PlacesService(this.map);
    this.service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
          this.createMarker(results[i]);
        }
        this.map.setCenter(results[0].geometry.location);
        console.log("place details", results[0].geometry.location);
        let loc = results[0].geometry.location;
        this.lat = loc.lat();
        this.lng = loc.lng();
        console.log("lattitude", loc.lat());
        console.log("longitude", loc.lng());
      }
    });
  }


  async mapReadyHandler(e: any) {
    this.manual = true;

    const geocoder = new google.maps.Geocoder();
    let latlng = {
      lat: e.coords.lat,
      lng: e.coords.lng
    };


    await geocoder.geocode({
      'location': latlng
    }, (results) => {
      if (results[0]) {
        this.currentLocation = results[0];
        console.log("this.locs", this.currentLocation);
        const address_comp = this.currentLocation.address_components;
        this.address = address_comp[1].long_name;
        this.landmark = address_comp[2].long_name;
        this.country = address_comp[address_comp.length - 2].long_name;
        this.postal = address_comp[address_comp.length - 1].long_name;

      } else {
        console.log('Not found');
      }
    });


    this.lat = e.coords.lat;
    this.lng = e.coords.lng;
  }


  //New Functionality

  map: any;
  service: any;
  infowindow: any;


  initMap() {
    if (!this.manual) {
      const place = new google.maps.LatLng(this.lat, this.lng);
      this.infowindow = new google.maps.InfoWindow();
      this.map = new google.maps.Map(this.gmapElement.nativeElement,{
        zoom:15,
        // center: { lat: -33, lng: 151 },
      });

      const request = {
        query: this.query,
        fields: ["name", "geometry"],
      };

      this.service = new google.maps.places.PlacesService(this.map);
      this.service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            this.createMarker(results[i]);
          }
          this.map.setCenter(results[0].geometry.location);
          console.log("place details", results[0].geometry.location);
          let loc = results[0].geometry.location;
          this.lat = loc.lat();
          this.lng = loc.lng();
          console.log("lattitude", loc.lat());
          console.log("longitude", loc.lng());
        }
      });
    }

  }


  moveBus( map, marker ) {

    marker.setPosition( new google.maps.LatLng( 0, 0 ) );
    map.panTo( new google.maps.LatLng( 0, 0 ) );

};




  makeQuery(id) {
    console.log("test");
    console.log("coutry", this.country)
    const query = `${this.address},${this.country},${this.postal},${this.landmark}`;
    this.subject.next(query);

  }

   createMarker(place) {
    const marker = new google.maps.Marker({
      map:this.map,
      position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", () => {
      this.infowindow.setContent(place.name);
      this.infowindow.open(this.map);
    });
  }


}
