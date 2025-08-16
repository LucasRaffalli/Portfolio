import { Component, HostListener, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
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
export class DesignV2Component implements OnInit, AfterViewInit, OnDestroy {
  readonly ArrowUpRight = ArrowUpRight;
  readonly X = X;
  readonly MoveDown = MoveDown;
  readonly MoveUp = MoveUp;

  designs: Design[] = [];
  isLoading = true;
  currentIndex = 0;
  translateY = 0;

  // Modal
  isModalOpen = false;
  selectedDesign: Design | null = null;
  currentImageIndex = 0;

  // Configuration pour hauteurs dynamiques
  private destroy$ = new Subject<void>();
  private itemHeights: number[] = [];
  private itemPositions: number[] = [];

  // Propriétés pour le touch mobile
  private touchStartY = 0;
  private touchStartTime = 0;
  private readonly minSwipeDistance = 50;
  private readonly maxSwipeTime = 300;

  constructor(private designService: DesignService) { }

  ngOnInit() {
    this.loadDesigns();
  }

  ngAfterViewInit() {
    setTimeout(() => this.calculateItemHeights(), 200);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.isModalOpen && event.key === 'Escape') {
      this.closeModal();
      return;
    }

    if (!this.isModalOpen) {
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
  }

  @HostListener('wheel', ['$event'])
  handleWheel(event: WheelEvent) {
    if (this.isModalOpen) return;

    event.preventDefault();
    if (event.deltaY > 0) {
      this.nextItem();
    } else {
      this.previousItem();
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
    this.touchStartTime = Date.now();
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    event.preventDefault();
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const touchEndY = event.changedTouches[0].clientY;
    const touchEndTime = Date.now();

    const deltaY = this.touchStartY - touchEndY;
    const deltaTime = touchEndTime - this.touchStartTime;

    if (Math.abs(deltaY) >= this.minSwipeDistance && deltaTime <= this.maxSwipeTime) {
      if (deltaY > 0) {
        this.nextItem();
      } else {
        this.previousItem();
      }
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    setTimeout(() => this.calculateItemHeights(), 100);
  }

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
      this.openModal(design);
    } else {
      this.goToItem(index);
    }
  }

  openModal(design: Design) {
    this.selectedDesign = design;
    this.isModalOpen = true;
    this.currentImageIndex = 0;
    document.body.style.overflow = 'hidden';
  }
  closeModal() {
    this.isModalOpen = false;
    this.selectedDesign = null;
    this.currentImageIndex = 0;
    document.body.style.overflow = 'auto';
  }
  // Changer l'image principale
  selectImage(index: number) {
    this.currentImageIndex = index;
  }

  openExternalLink(url: string) {
    window.open(url, '_blank');
  }

  onImageLoad() {
    setTimeout(() => this.calculateItemHeights(), 50);
  }

  private calculateItemHeights() {
    const items = document.querySelectorAll('.carousel-track > div');

    if (items.length === 0) return;

    this.itemHeights = [];
    this.itemPositions = [0];

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      this.itemHeights[index] = rect.height;

      if (index > 0) {
        this.itemPositions[index] = this.itemPositions[index - 1] + this.itemHeights[index - 1];
      }
    });

    this.updateTransform();
  }

  private loadDesigns() {
    this.designService.getDesigns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (designs) => {
          this.designs = designs;
          this.isLoading = false;
          setTimeout(() => this.calculateItemHeights(), 300);
        },
        error: (error) => {
          console.error('Erreur chargement designs:', error);
          this.isLoading = false;
        }
      });
  }

  private updateTransform() {
    if (this.itemPositions.length > 0 && this.itemPositions[this.currentIndex] !== undefined) {
      this.translateY = -this.itemPositions[this.currentIndex];
    } else {
      this.translateY = -this.currentIndex * 400;
    }
  }
}