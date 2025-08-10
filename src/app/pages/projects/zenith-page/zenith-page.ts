import { Component } from '@angular/core';
import { ExternalLink, LucideAngularModule, ArrowUpRight } from 'lucide-angular';

@Component({
  selector: 'app-zenith-page',
  imports: [LucideAngularModule],
  templateUrl: './zenith-page.html',
  styleUrl: './zenith-page.css'
})
export class ZenithPageComponent {
  readonly ExternalLink = ExternalLink;
  readonly ArrowUpRight = ArrowUpRight
}
