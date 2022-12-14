import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
