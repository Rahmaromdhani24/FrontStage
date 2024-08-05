import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { TemplateComponent } from './template/template.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './Services/Services Authentification/auth-interceptor.service';
import { TableauuComponent } from './tableauu/tableauu.component';
import { AvEchelonComponent } from './av-echelon/av-echelon.component';
import { HistoriquesComponent } from './historiques/historiques.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HistoriquesPersonnelComponent } from './historiques-personnel/historiques-personnel.component';
import { HissComponent } from './hiss/hiss.component';
import { BarrComponent } from './barr/barr.component';
import { PersonnelsHomeComponent } from './personnels/personnels-home/personnels-home.component';
import { AvEchComponent } from './av-ech/av-ech.component';
import { AvancementComponent } from './avancement/avancement.component';
import { TableauAvancementComponent } from './tableau-avancement/tableau-avancement.component';
import { DatePipe } from '@angular/common';
import { ChangerSituationComponent } from './Situations/changer-situation/changer-situation.component';
import { PersonnelHoraireComponent } from './personnels/personnel-horaire/personnel-horaire.component';
import { PersonnelMensuelComponent } from './personnels/personnel-mensuel/personnel-mensuel.component';
import { PersonnelExceptionnel57AnsComponent } from './personnels/personnel-exceptionnel57-ans/personnel-exceptionnel57-ans.component';
import { AvancementPersonnelHoraireComponent } from './Avancement Echelon/avancement-personnel-horaire/avancement-personnel-horaire.component';
import { AvancementPersonnelMensuelComponent } from './Avancement Echelon/avancement-personnel-mensuel/avancement-personnel-mensuel.component';
import { ChangerSituationParMleComponent } from './changer-situation-par-mle/changer-situation-par-mle.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AvancementMoisHoraireComponent } from './Avancement mois/avancement-mois-horaire/avancement-mois-horaire.component';
import { AvancementMoisMensuelComponent } from './Avancement mois/avancement-mois-mensuel/avancement-mois-mensuel.component';
import { AvancementMensuelComponent } from './modifer avancement/avancement-mensuel/avancement-mensuel.component';
import { AvancementHoraireComponent } from './modifer avancement/avancement-horaire/avancement-horaire.component';
import { ChangerSituationPersonnelMensuelComponent } from './Situations/changer-situation-personnel-mensuel/changer-situation-personnel-mensuel.component';
import { UpdateAvancementMoisMensuelComponent } from './Update Avancement Mois/update-avancement-mois-mensuel/update-avancement-mois-mensuel.component';
import { UpdateAvancementMoisHoraireComponent } from './Update Avancement Mois/update-avancement-mois-horaire/update-avancement-mois-horaire.component';
import { MatTableModule } from '@angular/material/table';
import { PasConnecteComponent } from './pas-connecte/pas-connecte.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, CUSTOM_DATE_FORMATS } from './Services/Services Date/CustomDateAdapter' ;
import { MatIconModule } from "@angular/material/icon";


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginAdminComponent,
    TemplateComponent,
    PageNotFoundComponent,
    TableauuComponent,
    AvEchelonComponent,
    HistoriquesComponent,
    HistoriquesPersonnelComponent,
    HissComponent,
    BarrComponent,
    PersonnelsHomeComponent,
    AvEchComponent,
    AvancementComponent,
    TableauAvancementComponent,
    ChangerSituationComponent,
    PersonnelHoraireComponent,
    PersonnelMensuelComponent,
    PersonnelExceptionnel57AnsComponent,
    AvancementPersonnelHoraireComponent,
    AvancementPersonnelMensuelComponent,
    ChangerSituationParMleComponent,
    AvancementMoisHoraireComponent,
    AvancementMoisMensuelComponent,
    AvancementMensuelComponent,
    AvancementHoraireComponent,
    ChangerSituationPersonnelMensuelComponent,
    UpdateAvancementMoisMensuelComponent,
    UpdateAvancementMoisHoraireComponent,
    PasConnecteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule  ,
    CarouselModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule , 
    SweetAlert2Module.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },    
    DatePipe // Assurez-vous que DatePipe est inclus ici si nécessaire globalement
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
