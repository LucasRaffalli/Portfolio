import { Component, HostListener, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Design } from '../../interfaces/design.interface';
import { DesignService } from '../../services/design.service';
import { CommonModule } from '@angular/common';
import { ExternalLink, LucideAngularModule, ArrowUpRight, X, MoveDown, MoveUp } from 'lucide-angular';

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

  private destroy$ = new Subject<void>();
  private itemHeights: number[] = [];
  private itemPositions: number[] = [];

  private touchStartY = 0;
  private touchStartTime = 0;
  private isDragging = false;
  private isScrolling = false;
  private dragOffset = 0;
  private startTranslateY = 0;
  private velocity = 0;
  private lastTouchY = 0;
  private lastTouchTime = 0;
  private animationFrame: number | null = null;
  private scrollTimeout: number | null = null;
  private wheelAccumulator = 0;

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
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.isModalOpen && event.key === 'Escape') {
      this.closeModal();
      return;
    }

    if (!this.isModalOpen && !this.isDragging && !this.isScrolling) {
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
    const target = event.target as HTMLElement;
    const isFromOverlay = target.closest('.scroll-overlay') ||
      target.closest('.design__container');

    if (this.isModalOpen || this.isDragging || !isFromOverlay) return;

    event.preventDefault();

    this.isScrolling = true;
    this.wheelAccumulator += event.deltaY;

    // Applique le scroll de manière fluide
    const scrollSensitivity = 0.5;
    const newTranslateY = this.translateY - (event.deltaY * scrollSensitivity);

    // Limite le scroll dans les bornes
    const maxTranslateY = 0;
    const minTranslateY = this.itemPositions.length > 0
      ? -this.itemPositions[this.itemPositions.length - 1]
      : -(this.designs.length - 1) * 400;

    this.translateY = Math.max(minTranslateY, Math.min(maxTranslateY, newTranslateY));

    // Met à jour currentIndex pendant le scroll
    this.updateCurrentIndex();

    // Reset le timeout de fin de scroll
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Attend la fin du scroll pour snapper au plus proche
    this.scrollTimeout = window.setTimeout(() => {
      this.snapToClosest();
      this.isScrolling = false;
      this.wheelAccumulator = 0;
    }, 150);
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

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
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

    // Effet de rebond en haut
    if (proposedTranslate > 0) {
      finalOffset = this.dragOffset * 0.3;
    }

    // Effet de rebond en bas
    const maxTranslate = this.itemPositions.length > 0 ?
      -this.itemPositions[this.itemPositions.length - 1] :
      -(this.designs.length - 1) * 400;

    if (proposedTranslate < maxTranslate) {
      const overscroll = proposedTranslate - maxTranslate;
      finalOffset = this.dragOffset + overscroll * 0.3;
    }

    this.translateY = this.startTranslateY + finalOffset;

    // Met à jour currentIndex en temps réel pendant le drag
    this.updateCurrentIndex();
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (this.isModalOpen || !this.isDragging) return;

    this.isDragging = false;

    // Si la vélocité est importante, continue le scroll avec momentum
    if (Math.abs(this.velocity) > 300) {
      this.applyMomentumScroll();
    } else {
      // Sinon snap immédiatement au plus proche
      this.snapToClosest();
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

    if (!this.isDragging && !this.isScrolling) {
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

  private snapToClosest() {
    if (this.itemPositions.length === 0) return;

    let closestIndex = 0;
    let minDistance = Math.abs(this.translateY);

    this.itemPositions.forEach((position, index) => {
      const distance = Math.abs(this.translateY + position);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    // Ne fait l'animation que si on n'est pas déjà sur le bon élément
    if (closestIndex !== this.currentIndex ||
      Math.abs(this.translateY + this.itemPositions[closestIndex]) > 5) {
      this.currentIndex = closestIndex;
      this.animateToIndex(closestIndex);
    }
  }

  private applyMomentumScroll() {
    let currentVelocity = this.velocity;
    const deceleration = 0.95;
    const minVelocity = 50;

    const momentum = () => {
      currentVelocity *= deceleration;

      if (Math.abs(currentVelocity) < minVelocity) {
        this.snapToClosest();
        return;
      }

      const newTranslateY = this.translateY + currentVelocity / 60;

      // Limite le scroll dans les bornes
      const maxTranslateY = 0;
      const minTranslateY = this.itemPositions.length > 0
        ? -this.itemPositions[this.itemPositions.length - 1]
        : -(this.designs.length - 1) * 400;

      if (newTranslateY > maxTranslateY || newTranslateY < minTranslateY) {
        this.snapToClosest();
        return;
      }

      this.translateY = newTranslateY;
      this.updateCurrentIndex();
      this.animationFrame = requestAnimationFrame(momentum);
    };

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(momentum);
  }

  private updateCurrentIndex() {
    if (this.itemPositions.length === 0) return;

    let closestIndex = 0;
    let minDistance = Math.abs(this.translateY);

    this.itemPositions.forEach((position, index) => {
      const distance = Math.abs(this.translateY + position);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    this.currentIndex = closestIndex;
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