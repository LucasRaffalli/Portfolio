import { Component } from '@angular/core';
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
}
