import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Design } from '../../interfaces/design.interface';
import { DesignService } from '../../services/design.service';
import { CommonModule } from '@angular/common';
import { ExternalLink, LucideAngularModule, ArrowUpRight, X, Filter, ChevronDown, ChevronRight, ChevronLeft, MoveDown, MoveUp } from 'lucide-angular';

@Component({
  selector: 'app-design-v2',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './design-v2.html',
  styleUrl: './design-v2.css'
})
export class DesignV2Component implements OnInit, OnDestroy {
  readonly ArrowUpRight = ArrowUpRight;
  readonly MoveDown = MoveDown;
  readonly MoveUp = MoveUp;

  // Propriétés pour le template
  designs: Design[] = [];
  isLoading = true;
  currentIndex = 0;
  translateY = 0;

  // Configuration
  private readonly itemHeight = 400; // Hauteur d'un item en px
  private destroy$ = new Subject<void>();

  constructor(private designService: DesignService) { }

  ngOnInit() {
    this.loadDesigns();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Navigation clavier - écoute les touches fléchées
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.previousItem();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.nextItem();
        break;
    }
  }

  // Navigation molette - scroll haut/bas
  @HostListener('wheel', ['$event'])
  handleWheel(event: WheelEvent) {
    event.preventDefault();

    if (event.deltaY > 0) {
      this.nextItem();
    } else {
      this.previousItem();
    }
  }

  // Méthodes publiques utilisées dans le template
  trackByFn(index: number, design: Design): string {
    return design.id;
  }

  nextItem() {
    if (this.currentIndex < this.designs.length - 1) {
      this.currentIndex++;
      this.updateTransform();
    }
  }

  previousItem() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateTransform();
    }
  }

  goToItem(index: number) {
    this.currentIndex = index;
    this.updateTransform();
  }

  onItemClick(design: Design, index: number) {
    if (index === this.currentIndex) {
      // Ouvrir le lien externe si c'est l'item actif
      window.open(design.url, '_blank');
    } else {
      // Naviguer vers cet item
      this.goToItem(index);
    }
  }

  // Méthodes privées
  private loadDesigns() {
    this.designService.getDesigns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (designs) => {
          this.designs = designs;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur chargement designs:', error);
          this.isLoading = false;
        }
      });
  }

  private updateTransform() {
    this.translateY = -this.currentIndex * this.itemHeight;
  }
}
