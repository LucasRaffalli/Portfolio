import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MarkdownComponent } from "ngx-markdown";

interface DocData {
  src: string;
  title: string;
  project: string;
}

@Component({
  selector: 'app-documentation',
  imports: [MarkdownComponent],
  templateUrl: './documentation.html',
  styleUrl: './documentation.css'
})
export class DocumentationComponent implements OnInit, OnDestroy {
  docData: DocData | null = null;
  projectName: string = '';
  loading: boolean = true;
  private destroy$ = new Subject<void>();

  private readonly validProjects = ['anom', 'aurora', 'hephai', 'lumina', 'zenith'];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.projectName = params['project'];
      this.loadDocumentation();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDocumentation(): void {
    this.loading = true;

    if (!this.isValidProject(this.projectName)) {
      this.docData = null;
      this.loading = false;
      return;
    }

    // Construire le chemin vers le fichier markdown
    const docPath = `../../../../../assets/data/doc/${this.projectName}.md`;
    const title = this.getProjectTitle(this.projectName);

    this.docData = {
      src: docPath,
      title: title,
      project: this.projectName
    };

    this.loading = false;
  }

  private isValidProject(project: string): boolean {
    return this.validProjects.includes(project);
  }

  private getProjectTitle(project: string): string {
    const titles: { [key: string]: string } = {
      'anom': 'Anom Documentation',
      'aurora': 'Aurora Documentation',
      'hephai': 'Hephai Documentation',
      'lumina': 'Lumina Documentation',
      'zenith': 'Zenith Documentation'
    };
    return titles[project] || `${project.charAt(0).toUpperCase() + project.slice(1)} Documentation`;
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
