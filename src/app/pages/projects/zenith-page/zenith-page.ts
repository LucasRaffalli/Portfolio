import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ExternalLink, LucideAngularModule, ArrowUpRight } from 'lucide-angular';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-zenith-page',
  imports: [LucideAngularModule, RouterModule],
  templateUrl: './zenith-page.html',
  styleUrl: './zenith-page.css'
})
export class ZenithPageComponent {
  readonly ExternalLink = ExternalLink;
  readonly ArrowUpRight = ArrowUpRight

  constructor(private router: Router) { }

  openDoc() {
    this.router.navigate(['/doc/zenith']);
  }
}

