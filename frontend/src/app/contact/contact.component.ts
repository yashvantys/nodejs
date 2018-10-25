import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ContactService } from '../services/contact.service'
declare let google: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  error: boolean = false;
  emailSend: boolean = false;
  uluru: Object = { lat: 23.2373581, lng: 72.62320999999997 };
  map: Object;
  marker: Object;
  zoom: number;
  @ViewChild('map') mapRef: ElementRef;

  constructor(private contactFormBuilder: FormBuilder, private contactservice: ContactService) { }

  ngOnInit() {
    this.contactForm = this.contactFormBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      message: ['', [Validators.required]]
    })

    setTimeout(() => {
      this.map = new google.maps.Map(this.mapRef.nativeElement, {
        zoom: 4,
        center: this.uluru
      });
      this.marker = new google.maps.Marker({
        position: this.uluru,
        map: this.map
      });

    }, 2000)

  }

  contact() {
    this.contactservice.sendEmail(this.contactForm.value).subscribe(
      data => {
        this.emailSend = true;
        setTimeout(() => {
          this.emailSend = false;
        }, 5000);
        this.contactForm.reset();
      },
      error => {
        this.error = true
      });

  }

}
