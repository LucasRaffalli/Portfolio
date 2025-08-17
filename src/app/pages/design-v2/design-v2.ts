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

  // Propriétés pour le touch mobile amélioré
  private touchStartY = 0;
  private touchStartTime = 0;
  private isDragging = false;
  private dragOffset = 0;
  private startTranslateY = 0;
  private velocity = 0;
  private lastTouchY = 0;
  private lastTouchTime = 0;
  private animationFrame: number | null = null;

  private readonly snapThreshold = 0.3;

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
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.isModalOpen && event.key === 'Escape') {
      this.closeModal();
      return;
    }

    if (!this.isModalOpen && !this.isDragging) {
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
    if (this.isModalOpen || this.isDragging) return;

    event.preventDefault();
    if (event.deltaY > 0) {
      this.nextItem();
    } else {
      this.previousItem();
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (this.isModalOpen) return;

    this.touchStartY = event.touches[0].clientY;
    this.lastTouchY = this.touchStartY;
    this.touchStartTime = Date.now();
    this.lastTouchTime = this.touchStartTime;
    this.isDragging = true;
    this.dragOffset = 0;
    this.startTranslateY = this.translateY;
    this.velocity = 0;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.isModalOpen || !this.isDragging) return;

    event.preventDefault();

    const currentY = event.touches[0].clientY;
    const currentTime = Date.now();

    this.dragOffset = currentY - this.touchStartY;
    const timeDelta = currentTime - this.lastTouchTime;

    if (timeDelta > 0) {
      const distanceDelta = currentY - this.lastTouchY;
      this.velocity = distanceDelta / timeDelta * 1000;
    }

    this.lastTouchY = currentY;
    this.lastTouchTime = currentTime;

    let finalOffset = this.dragOffset;
    const proposedTranslate = this.startTranslateY + finalOffset;

    if (proposedTranslate > 0) {
      finalOffset = this.dragOffset * 0.3;
    }

    const maxTranslate = this.itemPositions.length > 0 ?
      -this.itemPositions[this.itemPositions.length - 1] :
      -(this.designs.length - 1) * 400;

    if (proposedTranslate < maxTranslate) {
      const overscroll = proposedTranslate - maxTranslate;
      finalOffset = this.dragOffset + overscroll * 0.3;
    }

    this.translateY = this.startTranslateY + finalOffset;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (this.isModalOpen || !this.isDragging) return;

    this.isDragging = false;

    const touchEndY = event.changedTouches[0].clientY;
    const totalDelta = touchEndY - this.touchStartY;

    let targetIndex = this.currentIndex;

    if (Math.abs(this.velocity) > 300) {
      if (this.velocity < 0 && this.currentIndex < this.designs.length - 1) {
        targetIndex = this.currentIndex + 1;
      } else if (this.velocity > 0 && this.currentIndex > 0) {
        targetIndex = this.currentIndex - 1;
      }
    } else {
      const currentItemHeight = this.itemHeights[this.currentIndex] || 400;
      const threshold = currentItemHeight * this.snapThreshold;

      if (Math.abs(totalDelta) > threshold) {
        if (totalDelta < 0 && this.currentIndex < this.designs.length - 1) {
          targetIndex = this.currentIndex + 1;
        } else if (totalDelta > 0 && this.currentIndex > 0) {
          targetIndex = this.currentIndex - 1;
        }
      }
    }

    this.animateToIndex(targetIndex);
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
      this.animateToIndex(this.currentIndex + 1);
    }
  }

  previousItem() {
    if (this.currentIndex > 0) {
      this.animateToIndex(this.currentIndex - 1);
    }
  }

  goToItem(index: number) {
    this.animateToIndex(index);
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

    if (!this.isDragging) {
      this.updateTransform();
    }
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

  private animateToIndex(targetIndex: number) {
    if (targetIndex < 0 || targetIndex >= this.designs.length) return;

    this.currentIndex = targetIndex;
    const targetY = this.itemPositions.length > 0 ?
      -this.itemPositions[targetIndex] :
      -targetIndex * 400;

    this.animateToPosition(targetY);
  }

  private animateToPosition(targetY: number) {
    const startY = this.translateY;
    const distance = targetY - startY;
    const duration = Math.min(Math.abs(distance) / 2, 300);
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      this.translateY = startY + distance * easeProgress;

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.animationFrame = null;
        this.translateY = targetY;
      }
    };

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(animate);
  }
}