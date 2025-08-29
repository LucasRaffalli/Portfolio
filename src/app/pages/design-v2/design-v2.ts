import { Component, HostListener, OnDestroy, OnInit, AfterViewInit, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Design } from '../../interfaces/design.interface';
import { DesignService } from '../../services/design.service';
import { CommonModule } from '@angular/common';
import { ArrowUpRight, X, MoveDown, MoveUp, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-design-v2',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './design-v2.html',
  styleUrl: './design-v2.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignV2Component implements OnInit, AfterViewInit, OnDestroy {
  readonly ArrowUpRight = ArrowUpRight;
  readonly X = X;
  readonly MoveDown = MoveDown;
  readonly MoveUp = MoveUp;

  private readonly designService = inject(DesignService);
  private readonly cdr = inject(ChangeDetectorRef);

  // État principal
  designs: Design[] = [];
  isLoading = true;
  currentIndex = 0;
  translateY = 0;

  // Modal
  isModalOpen = false;
  selectedDesign: Design | null = null;
  currentImageIndex = 0;

  private readonly destroy$ = new Subject<void>();

  // scroll/touch
  private scrollState = {
    itemHeights: [] as number[],
    itemPositions: [] as number[],
    touchStartY: 0,
    touchStartTime: 0,
    isDragging: false,
    isScrolling: false,
    dragOffset: 0,
    startTranslateY: 0,
    velocity: 0,
    lastTouchY: 0,
    lastTouchTime: 0,
    wheelAccumulator: 0
  };

  // Animations
  private animationId: number | null = null;
  private scrollTimeoutId: number | null = null;

  private isInitialized = false;

  // paramètres
  private readonly SCROLL_SENSITIVITY = 0.5;
  private readonly VELOCITY_THRESHOLD = 300;
  private readonly MIN_VELOCITY = 50;
  private readonly DECELERATION = 0.95;
  private readonly OVERSCROLL_DAMPING = 0.3;
  private readonly DEFAULT_ITEM_HEIGHT = 400;
  private readonly SCROLL_TIMEOUT = 150;
  private readonly ANIMATION_MAX_DURATION = 300;
  private readonly MAX_OVERSCROLL = 100;

  ngOnInit() {
    this.loadDesigns();
  }

  ngAfterViewInit() {
    this.scheduleHeightCalculation(200);
  }

  ngOnDestroy() {
    this.cleanup();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isInitialized || this.isModalOpen) {
      if (event.key === 'Escape' && this.isModalOpen) this.closeModal();
      return;
    }

    if (this.scrollState.isDragging || this.scrollState.isScrolling) return;

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

  @HostListener('wheel', ['$event'])
  handleWheel(event: WheelEvent) {
    if (!this.isInitialized || !this.canHandleScroll(event)) return;

    event.preventDefault();
    this.handleWheelScroll(event.deltaY);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (!this.isInitialized || this.isModalOpen) return;
    this.initTouchGesture(event.touches[0]);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.isInitialized || this.isModalOpen || !this.scrollState.isDragging) return;

    event.preventDefault();
    this.handleTouchMove(event.touches[0]);
    this.triggerChangeDetection();
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (!this.isInitialized || this.isModalOpen || !this.scrollState.isDragging) return;

    this.scrollState.isDragging = false;

    if (this.isOutOfBounds()) {
      this.snapToBounds();
    } else if (Math.abs(this.scrollState.velocity) > this.VELOCITY_THRESHOLD) {
      this.applyMomentumScroll();
    } else {
      this.snapToNearestItem();
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.isInitialized) {
      this.scheduleHeightCalculation(100);
    }
  }

  trackByFn = (index: number, design: Design): string => design.id;

  nextItem() {
    if (!this.isInitialized || this.currentIndex >= this.designs.length - 1) return;
    this.animateToIndex(this.currentIndex + 1);
  }

  previousItem() {
    if (!this.isInitialized || this.currentIndex <= 0) return;
    this.animateToIndex(this.currentIndex - 1);
  }

  goToItem(index: number) {
    if (!this.isInitialized) return;
    this.animateToIndex(index);
  }

  onItemClick(design: Design, index: number) {
    if (!this.isInitialized) return;

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
    this.cdr.markForCheck();
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedDesign = null;
    this.currentImageIndex = 0;
    document.body.style.overflow = '';
    this.cdr.markForCheck();
  }

  selectImage(index: number) {
    this.currentImageIndex = index;
    this.cdr.markForCheck();
  }

  openExternalLink(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  onImageLoad() {
    this.scheduleHeightCalculation(50);
  }

  private canHandleScroll(event: WheelEvent): boolean {
    const target = event.target as HTMLElement;
    const isFromOverlay = !!(target.closest('.scroll-overlay') || target.closest('.design__container'));

    return !this.isModalOpen && !this.scrollState.isDragging && isFromOverlay;
  }

  private handleWheelScroll(deltaY: number) {
    this.scrollState.isScrolling = true;
    this.scrollState.wheelAccumulator += deltaY;

    const newTranslateY = this.translateY - (deltaY * this.SCROLL_SENSITIVITY);
    this.translateY = this.clampTranslateY(newTranslateY);
    this.updateCurrentIndex();
    this.triggerChangeDetection();

    this.clearScrollTimeout();
    this.scrollTimeoutId = window.setTimeout(() => {
      this.scrollState.isScrolling = false;
      this.scrollState.wheelAccumulator = 0;
    }, this.SCROLL_TIMEOUT);
  }

  private initTouchGesture(touch: Touch) {
    const currentTime = Date.now();

    Object.assign(this.scrollState, {
      touchStartY: touch.clientY,
      lastTouchY: touch.clientY,
      touchStartTime: currentTime,
      lastTouchTime: currentTime,
      isDragging: true,
      dragOffset: 0,
      velocity: 0
    });

    this.scrollState.startTranslateY = this.translateY;
    this.cancelAnimations();
  }

  private handleTouchMove(touch: Touch) {
    const currentY = touch.clientY;
    const currentTime = Date.now();

    this.scrollState.dragOffset = currentY - this.scrollState.touchStartY;

    const timeDelta = currentTime - this.scrollState.lastTouchTime;
    if (timeDelta > 0) {
      const distanceDelta = currentY - this.scrollState.lastTouchY;
      this.scrollState.velocity = (distanceDelta / timeDelta) * 1000;
    }

    this.scrollState.lastTouchY = currentY;
    this.scrollState.lastTouchTime = currentTime;

    const finalOffset = this.calculateDragOffset();
    this.translateY = this.scrollState.startTranslateY + finalOffset;

    this.translateY = this.clampTranslateYWithOverscroll(this.translateY);

    this.updateCurrentIndex();
  }

  private calculateDragOffset(): number {
    return this.scrollState.dragOffset;
  }

  private scheduleHeightCalculation(delay: number) {
    setTimeout(() => this.calculateItemHeights(), delay);
  }

  private calculateItemHeights() {
    const items = document.querySelectorAll('.carousel-track > div');
    if (items.length === 0) return;

    this.scrollState.itemHeights = [];
    this.scrollState.itemPositions = [0];

    items.forEach((item, index) => {
      const height = item.getBoundingClientRect().height;
      this.scrollState.itemHeights[index] = height;

      if (index > 0) {
        this.scrollState.itemPositions[index] =
          this.scrollState.itemPositions[index - 1] + this.scrollState.itemHeights[index - 1];
      }
    });

    if (!this.scrollState.isDragging && !this.scrollState.isScrolling) {
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
          this.isInitialized = true;
          this.cdr.markForCheck();
          this.scheduleHeightCalculation(50);
        },
        error: (error) => {
          console.error('Erreur chargement designs:', error);
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  private updateTransform() {
    const targetPosition = this.scrollState.itemPositions[this.currentIndex];
    this.translateY = targetPosition !== undefined
      ? -targetPosition
      : -this.currentIndex * this.DEFAULT_ITEM_HEIGHT;

    this.triggerChangeDetection();
  }

  private applyMomentumScroll() {
    let currentVelocity = this.scrollState.velocity;

    const momentum = () => {
      currentVelocity *= this.DECELERATION;

      if (Math.abs(currentVelocity) < this.MIN_VELOCITY) {
        this.snapToNearestItem();
        return;
      }

      const newTranslateY = this.translateY + currentVelocity / 60;
      const clampedY = this.clampTranslateYWithOverscroll(newTranslateY);

      if (Math.abs(clampedY - newTranslateY) > 1) {
        currentVelocity *= 0.3;
      }

      this.translateY = clampedY;
      this.updateCurrentIndex();
      this.triggerChangeDetection();
      this.animationId = requestAnimationFrame(momentum);
    };

    this.cancelAnimations();
    this.animationId = requestAnimationFrame(momentum);
  }

  private updateCurrentIndex() {
    if (this.scrollState.itemPositions.length === 0) return;

    let closestIndex = 0;
    let minDistance = Math.abs(this.translateY);

    for (let i = 0; i < this.scrollState.itemPositions.length; i++) {
      const distance = Math.abs(this.translateY + this.scrollState.itemPositions[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    this.currentIndex = closestIndex;
  }

  private animateToIndex(targetIndex: number) {
    if (targetIndex < 0 || targetIndex >= this.designs.length) return;

    this.currentIndex = targetIndex;
    const targetY = this.scrollState.itemPositions.length > 0
      ? -this.scrollState.itemPositions[targetIndex]
      : -targetIndex * this.DEFAULT_ITEM_HEIGHT;

    this.animateToPosition(targetY);
  }

  private animateToPosition(targetY: number) {
    const startY = this.translateY;
    const distance = targetY - startY;
    const duration = Math.min(Math.abs(distance) / 2, this.ANIMATION_MAX_DURATION);
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      this.translateY = startY + distance * easeProgress;
      this.triggerChangeDetection();

      if (progress < 1) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.animationId = null;
        this.translateY = targetY;
        this.triggerChangeDetection();
      }
    };

    this.cancelAnimations();
    this.animationId = requestAnimationFrame(animate);
  }

  private getMaxTranslate(): number {
    return this.scrollState.itemPositions.length > 0
      ? -this.scrollState.itemPositions[this.scrollState.itemPositions.length - 1]
      : -(this.designs.length - 1) * this.DEFAULT_ITEM_HEIGHT;
  }

  private clampTranslateY(value: number): number {
    const maxTranslateY = 0;
    const minTranslateY = this.getMaxTranslate();
    return Math.max(minTranslateY, Math.min(maxTranslateY, value));
  }

  private clampTranslateYWithOverscroll(value: number): number {
    const maxTranslateY = 0;
    const minTranslateY = this.getMaxTranslate();

    if (value > maxTranslateY) {
      return Math.min(value, maxTranslateY + this.MAX_OVERSCROLL);
    }

    if (value < minTranslateY) {
      return Math.max(value, minTranslateY - this.MAX_OVERSCROLL);
    }

    return value;
  }

  private isOutOfBounds(): boolean {
    const maxTranslateY = 0;
    const minTranslateY = this.getMaxTranslate();
    return this.translateY > maxTranslateY || this.translateY < minTranslateY;
  }

  private snapToBounds() {
    const maxTranslateY = 0;
    const minTranslateY = this.getMaxTranslate();

    let targetY = this.translateY;

    if (this.translateY > maxTranslateY) {
      targetY = maxTranslateY;
      this.currentIndex = 0;
    } else if (this.translateY < minTranslateY) {
      targetY = minTranslateY;
      this.currentIndex = this.designs.length - 1;
    }

    this.animateToPosition(targetY);
  }

  private snapToNearestItem() {
    this.updateCurrentIndex();
    const targetY = this.scrollState.itemPositions.length > 0
      ? -this.scrollState.itemPositions[this.currentIndex]
      : -this.currentIndex * this.DEFAULT_ITEM_HEIGHT;

    this.animateToPosition(targetY);
  }

  private triggerChangeDetection() {
    if (this.isInitialized) {
      this.cdr.markForCheck();
    }
  }

  private cancelAnimations() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private clearScrollTimeout() {
    if (this.scrollTimeoutId) {
      clearTimeout(this.scrollTimeoutId);
      this.scrollTimeoutId = null;
    }
  }

  private cleanup() {
    this.destroy$.next();
    this.destroy$.complete();
    this.cancelAnimations();
    this.clearScrollTimeout();

    if (this.isModalOpen) {
      document.body.style.overflow = '';
    }
  }
}