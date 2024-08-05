import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TemplateComponent } from './template/template.component';
import { TableauuComponent } from './tableauu/tableauu.component';
import { HistoriquesComponent } from './historiques/historiques.component';
import { AvEchelonComponent } from './av-echelon/av-echelon.component';
import { HissComponent } from './hiss/hiss.component';
import { BarrComponent } from './barr/barr.component';
import { PersonnelsHomeComponent } from './personnels/personnels-home/personnels-home.component';
import { AvEchComponent } from './av-ech/av-ech.component';
import { AvancementComponent } from './avancement/avancement.component';
import { TableauAvancementComponent } from './tableau-avancement/tableau-avancement.component';
import { ClearLocalStorageResolverService } from './Services/clear-local-storage-resolver.service';
import { ChangerSituationComponent } from './Situations/changer-situation/changer-situation.component';
import { PersonnelHoraireComponent } from './personnels/personnel-horaire/personnel-horaire.component';
import { PersonnelMensuelComponent } from './personnels/personnel-mensuel/personnel-mensuel.component';
import { PersonnelExceptionnel57AnsComponent } from './personnels/personnel-exceptionnel57-ans/personnel-exceptionnel57-ans.component';
import { AvancementPersonnelMensuelComponent } from './Avancement Echelon/avancement-personnel-mensuel/avancement-personnel-mensuel.component';
import { AvancementPersonnelHoraireComponent } from './Avancement Echelon/avancement-personnel-horaire/avancement-personnel-horaire.component';
import { ChangerSituationParMleComponent } from './changer-situation-par-mle/changer-situation-par-mle.component';
import { AvancementMoisMensuelComponent } from './Avancement mois/avancement-mois-mensuel/avancement-mois-mensuel.component';
import { AvancementMoisHoraireComponent } from './Avancement mois/avancement-mois-horaire/avancement-mois-horaire.component';
import { AvancementHoraireComponent } from './modifer avancement/avancement-horaire/avancement-horaire.component';
import { AvancementMensuelComponent } from './modifer avancement/avancement-mensuel/avancement-mensuel.component';
import { ChangerSituationPersonnelMensuelComponent } from './Situations/changer-situation-personnel-mensuel/changer-situation-personnel-mensuel.component';
import { UpdateAvancementMoisMensuelComponent } from './Update Avancement Mois/update-avancement-mois-mensuel/update-avancement-mois-mensuel.component';
import { UpdateAvancementMoisHoraireComponent } from './Update Avancement Mois/update-avancement-mois-horaire/update-avancement-mois-horaire.component';
import { AuthGuard } from './Services/Service Auth Guard/auth.guard';
import { PasConnecteComponent } from './pas-connecte/pas-connecte.component';

const routes: Routes = [
  { path: '', component: LoginAdminComponent },
  { path: 'avEch', component: AvEchComponent },
  { path: 'template', component: TemplateComponent },
  { path: 'bar', component: BarrComponent },
  
  { path: 'login', component: LoginAdminComponent },

  { path: 'accueil', component: PersonnelsHomeComponent, canActivate: [AuthGuard] },
  { path: 'personnelHoraire', component: PersonnelHoraireComponent, canActivate: [AuthGuard] },
  { path: 'personnelMensuel', component: PersonnelMensuelComponent, canActivate: [AuthGuard] },
  { path: 'personnelExceptionnel57Ans', component: PersonnelExceptionnel57AnsComponent, canActivate: [AuthGuard] },

  { path: 'av', component: AvEchelonComponent, resolve: { clearLocalStorage: ClearLocalStorageResolverService }, canActivate: [AuthGuard] },
  { path: 'avancementMensuel', component: AvancementPersonnelMensuelComponent, resolve: { clearLocalStorage: ClearLocalStorageResolverService }, canActivate: [AuthGuard] },
  { path: 'avancementHoraire', component: AvancementPersonnelHoraireComponent, resolve: { clearLocalStorage: ClearLocalStorageResolverService }, canActivate: [AuthGuard] },

  { path: 'avancementMoisMensuel', component: AvancementMoisMensuelComponent, canActivate: [AuthGuard] },
  { path: 'avancementMoisHoraire', component: AvancementMoisHoraireComponent, canActivate: [AuthGuard] },
  { path: 'updateAvancementMoisMensuel', component: UpdateAvancementMoisMensuelComponent, canActivate: [AuthGuard] },
  { path: 'updateAvancementMoisHoraire', component: UpdateAvancementMoisHoraireComponent, canActivate: [AuthGuard] },
  { path: 'modifierAvancementsMoisHoraire', component: AvancementHoraireComponent, canActivate: [AuthGuard] },
  { path: 'modifierAvancementsMoisMensuel', component: AvancementMensuelComponent, canActivate: [AuthGuard] },

  { path: 'historiques', component: HistoriquesComponent, canActivate: [AuthGuard] },
  { path: 'historiquesPersonnel/:id', component: HissComponent, canActivate: [AuthGuard] },
  { path: 'avancementManquants', component: AvancementComponent, canActivate: [AuthGuard] },
  { path: 'tableauAv', component: TableauAvancementComponent, canActivate: [AuthGuard] },
  { path: 'changerSituationPersonnel', component: ChangerSituationComponent, canActivate: [AuthGuard] },
  { path: 'changerSituationPersonnelMensuel', component: ChangerSituationPersonnelMensuelComponent, canActivate: [AuthGuard] },
  { path: 'changerSituationPersonnel/:mle', component: ChangerSituationParMleComponent, canActivate: [AuthGuard] },
  { path: 'nonConnecté', component: PasConnecteComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
