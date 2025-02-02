import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProjectCreateFormComponent } from './components/project-create-form/project-create-form.component';
import { SvgImageGeneratorComponent } from './components/svg-image-generator/svg-image-generator.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'projects', component: ProjectsListComponent },
  { path: 'create-project', component: ProjectCreateFormComponent },
  { path: 'edit-project/:id', component: ProjectCreateFormComponent },
  { path: 'help', component: SvgImageGeneratorComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
