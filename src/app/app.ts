import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SvgSwitcherComponent } from "./components/svg-switcher/svg-switcher";
import { NavbarComponent } from "./components/navbar/navbar";
import { ExternalLink, LucideAngularModule, ArrowUpRight } from 'lucide-angular';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DesignService } from './services/design.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SvgSwitcherComponent, NavbarComponent, LucideAngularModule, AngularSvgIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {

  readonly ExternalLink = ExternalLink;
  readonly ArrowUpRight = ArrowUpRight
  theme: 'light' | 'dark' = 'light';
  isDesignPage = false;

  @ViewChild('routerWrapper', { static: false }) routerWrapper!: ElementRef;

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    this.theme = (savedTheme === 'dark') ? 'dark' : 'light';
    this.applyTheme();
  }

  toggleTheme() {
    this.theme = (this.theme === 'light') ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
  }

  setTheme(theme: 'light' | 'dark') {
    this.theme = theme;
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
  }
  constructor(
    private designService: DesignService,
    private router: Router
  ) {
    // Mettre à jour isDesignPage à chaque navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isDesignPage = event.urlAfterRedirects.includes('/design') || event.urlAfterRedirects.includes('/designs');
      }
    });
  }
  applyTheme() {
    const root = document.documentElement;
    if (this.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }


  protected title = 'Lucas Raffalli';
}
