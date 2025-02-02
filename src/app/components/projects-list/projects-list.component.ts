import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { StatusDialogComponent } from '../status-dialog/status-dialog.component';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {

  displayedColumns: string[] = ['srNo', 'projectName', 'projectNumber', 'projectId', 'clientName', 'actions'];
  dataSource: Project[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    // private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    // Fetch the projects from your API or service
    // For now, let's use mock data
    this.dataSource = [
      { id: 1, projectName: 'Project A', projectNumber: '001', clientName: 'Client X' },
      { id: 2, projectName: 'Project B', projectNumber: '002', clientName: 'Client Y' },
      // Add more projects as needed
    ];
  }

  onCopy(project: Project) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Copy',
        message: `Are you sure you want to copy the project "${project.projectName}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Call the copy API
        // this.projectService.copyProject(project.id).subscribe(response => {
        //   this.showStatusDialog('Copy Successful', `The project "${project.projectName}" was copied successfully.`);
        //   this.loadProjects();
        // }, error => {
        //   this.showStatusDialog('Copy Failed', `Failed to copy the project "${project.projectName}".`);
        // });
        this.showStatusDialog('Copy Successful', `The project "${project.projectName}" was copied successfully.`);
        this.loadProjects();
      }
    });
  }

  onDelete(project: Project) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the project "${project.projectName}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //Call the delete API
        // this.projectService.deleteProject(project.id).subscribe(response => {
        //   this.showStatusDialog('Delete Successful', `The project "${project.projectName}" was deleted successfully.`);
        //   this.loadProjects();
        // }, error => {
        //   this.showStatusDialog('Delete Failed', `Failed to delete the project "${project.projectName}".`);
        // });

        this.showStatusDialog('Delete Successful', `The project "${project.projectName}" was deleted successfully.`);
        this.loadProjects();
      }
    });
  }

  showStatusDialog(title: string, message: string) {
    this.dialog.open(StatusDialogComponent, {
      data: { title, message }
    });
  }

  onEdit(project: Project) {
    // Navigate to the edit component with the project ID
    this.router.navigate(['/edit-project', project.id]);
  }

}
