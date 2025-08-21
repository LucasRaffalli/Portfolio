import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalLink, LucideAngularModule, ArrowUpRight } from 'lucide-angular';

@Component({
  selector: 'app-aurora-page',
  imports: [LucideAngularModule],
  templateUrl: './aurora-page.html',
  styleUrl: './aurora-page.css'
})
export class AuroraPageComponent {
  readonly ExternalLink = ExternalLink;
  readonly ArrowUpRight = ArrowUpRight

  constructor(private router: Router) { }

  openDoc() {
    this.router.navigate(['/doc/aurora']);
  }
}
