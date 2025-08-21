import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalLink, LucideAngularModule, ArrowUpRight } from 'lucide-angular';

@Component({
  selector: 'app-anom-page',
  imports: [LucideAngularModule],
  templateUrl: './anom-page.html',
  styleUrl: './anom-page.css'
})
export class AnomPageComponent {
  readonly ExternalLink = ExternalLink;
  readonly ArrowUpRight = ArrowUpRight
  constructor(private router: Router) { }

  openDoc() {
    this.router.navigate(['/doc/anom']);
  }
}
