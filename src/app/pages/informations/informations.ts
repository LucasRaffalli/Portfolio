import { Component } from '@angular/core';
import { ExternalLink, LucideAngularModule, ArrowUpRight } from 'lucide-angular';
@Component({
  selector: 'app-informations',
  imports: [LucideAngularModule],
  templateUrl: './informations.html',
  styleUrl: './informations.css'
})
export class InformationsComponent {
  readonly ExternalLink = ExternalLink;
  readonly ArrowUpRight = ArrowUpRight
  isDarkTheme = true;

  get iconColor() {
    return this.isDarkTheme ? 'white' : 'black';
  }
}
