import { Component } from '@angular/core';
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
}
