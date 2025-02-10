import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProjectCreateFormComponent } from './components/project-create-form/project-create-form.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { EditableSvgComponent } from './components/editable-svg/editable-svg.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'projects', component: ProjectsListComponent },
  { path: 'create-project', component: ProjectCreateFormComponent },
  { path: 'edit-project/:projectUniqueId', component: ProjectCreateFormComponent },
  { path: 'input-dragger', component: EditableSvgComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
