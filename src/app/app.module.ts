import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_DATE_FORMATS } from './date-formats';
import { DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';

// components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProjectCreateFormComponent } from './components/project-create-form/project-create-form.component';
import { HeaderComponent } from './components/header/header.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { TankDetailsComponent } from './components/tank-details/tank-details.component';
import { TopCoverDetailsComponent } from './components/top-cover-details/top-cover-details.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { StatusDialogComponent } from './components/status-dialog/status-dialog.component';
import { EditableSvgComponent } from './components/editable-svg/editable-svg.component';
import { LvTrunkingDetailsComponent } from './components/lv-trunking-details/lv-trunking-details.component';
import { HvLvTurretDetailsComponent } from './components/hv-lv-turret-details/hv-lv-turret-details.component';
import { ConservatorSupportDetailsComponent } from './components/conservator-support-details/conservator-support-details.component';
import { ConservatorDetailsComponent } from './components/conservator-details/conservator-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProjectCreateFormComponent,
    HeaderComponent,
    ProjectDetailsComponent,
    TankDetailsComponent,
    TopCoverDetailsComponent,
    ProjectsListComponent,
    ConfirmationDialogComponent,
    StatusDialogComponent,
    EditableSvgComponent,
    LvTrunkingDetailsComponent,
    HvLvTurretDetailsComponent,
    ConservatorSupportDetailsComponent,
    ConservatorDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule,
    DragDropModule,
    MatExpansionModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
