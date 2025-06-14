import { Component, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../models/project.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { StatusDialogComponent } from '../status-dialog/status-dialog.component';
import { ProjectService } from '../../services/project.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {

  displayedColumns: string[] = ['srNo', 'projectName', 'projectNumber', 'projectId', 'clientName', 'status', 'actions'];
  dataSource: MatTableDataSource<Project> = new MatTableDataSource<Project>();
  selectedStatus: string[] = [];
  searchKey: string = '';
  page = 1;
  pageSize = 10;
  totalCount = 0;
  sortBy = 'projectName';
  sortDirection = 'asc';
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.selectedStatus = ['Active'];
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getPagedProjects(
      this.page,
      this.pageSize,
      this.searchKey,
      this.sortBy,
      this.sortDirection,
      this.selectedStatus
    ).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.projects);
        this.totalCount = res.totalCount;
      },
      error: () => {
        this.showStatusDialog('Error', 'Failed to load projects. Please try again later.');
      }
    });
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
        // Create a copy of the project with modified fields
        const projectCopy = { ...project };
        projectCopy.projectNumber = `${project.projectNumber}_copy`;
        if (projectCopy.projectId) {
          projectCopy.projectId = `${project.projectId}_copy`;
        }

        projectCopy.copiedUniqueId = projectCopy.projectUniqueId;
        // Remove any unique identifiers that should be generated by the backend
        delete projectCopy.projectUniqueId;

        // Add a flag to indicate the project has been copied
        projectCopy.isCopied = true;

        this.projectService.createProject(projectCopy).subscribe({
          next: () => {
            this.showStatusDialog('Copy Successful', `The project "${project.projectName}" was copied successfully.`);
            this.loadProjects();
          },
          error: (error) => {
            this.showStatusDialog('Copy Failed', `Failed to copy the project "${project.projectName}".`);
          }
        });
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
        if (project.projectUniqueId) { // Check if projectUniqueId exists
          this.projectService.deleteProject(project.projectUniqueId?.toString()).subscribe({
            next: () => {
              this.showStatusDialog('Status Update Successful', `The project "${project.projectName}" was marked as deleted.`);
              this.loadProjects();
            },
            error: (error) => {
              this.showStatusDialog('Status Update Failed', `Failed to mark the project "${project.projectName}" as deleted.`);
            }
          });
        } else {
          this.showStatusDialog('Error', 'Project ID is missing. Cannot delete.');
        }
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
    this.router.navigate(['/edit-project', project.projectUniqueId]);
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProjects();
  }

  onSortChange(sort: Sort) {
    if (sort.direction) {
      this.sortBy = sort.active;
      this.sortDirection = sort.direction;
    } else {
      this.sortBy = 'projectName';
      this.sortDirection = 'asc';

      setTimeout(() => {
        if (this.sort) {
          this.sort.active = this.sortBy;
          this.sort.direction = this.sortDirection as 'asc' | 'desc';
        }
      }, 0);
    }

    this.loadProjects();
  }

  applyFilter() {
    this.page = 1; // Reset to first page on search
    this.loadProjects();
  }

}
