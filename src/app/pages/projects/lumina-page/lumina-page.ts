import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalLink, LucideAngularModule, ArrowUpRight } from 'lucide-angular';

@Component({
  selector: 'app-lumina-page',
  imports: [LucideAngularModule],
  templateUrl: './lumina-page.html',
  styleUrl: './lumina-page.css'
})
export class LuminaPageComponent {
  readonly ExternalLink = ExternalLink;
  readonly ArrowUpRight = ArrowUpRight

  constructor(private router: Router) { }

  openDoc() {
    this.router.navigate(['/doc/lumina']);
  }
}
