import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SlotMachineComponent } from './slot-machine/slot-machine.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PayTableComponent } from './pay-table/pay-table.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    AppComponent,
    SlotMachineComponent,
    PayTableComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
