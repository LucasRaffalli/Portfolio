import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalLink, LucideAngularModule, ArrowUpRight } from 'lucide-angular';

@Component({
  selector: 'app-hephai-page',
  imports: [LucideAngularModule],
  templateUrl: './hephai-page.html',
  styleUrl: './hephai-page.css'
})
export class HephaiPageComponent {
  readonly ExternalLink = ExternalLink;
  readonly ArrowUpRight = ArrowUpRight
  constructor(private router: Router) { }

  openDoc() {
    this.router.navigate(['/doc/hephai']);
  }

}
