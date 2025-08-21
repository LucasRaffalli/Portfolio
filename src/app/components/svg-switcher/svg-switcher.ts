import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-svg-switcher',
  imports: [CommonModule],
  templateUrl: './svg-switcher.html',
  styleUrl: './svg-switcher.css'
})
export class SvgSwitcherComponent {
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  get currentSvg(): string {
    const routeToSvgMap: Record<string, string> = {
      '/': 'default',
      '/projects/hephai': 'hephai',
      '/projects/hephai/doc': 'hephai',
      '/projects/lumina': 'lumina',
      '/projects/lumina/doc': 'lumina',
      '/projects/aurora': 'aurora',
      '/projects/aurora/doc': 'aurora',
      '/projects/zenith': 'zenith',
      '/projects/zenith/doc': 'zenith',
      '/projects/anom': 'anom',
      '/projects/anom/doc': 'anom',
      '/projects': 'default',
      '/informations': 'default',
      '/contact': 'default',
    };

    return routeToSvgMap[this.currentRoute] || 'default';
  }
  svgClassMap: Record<string, string> = {
    default: 'lucas',
    hephai: 'hephai',
    lumina: 'lumina',
    aurora: 'aurora',
    zenith: 'zenith',
    anom: 'anom',
  };
  svgs: string[] = ['default', 'hephai', 'lumina', 'aurora', 'zenith', 'anom'];
}
