import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DESIGN_IMAGES } from './design-images';
import { DesignItem } from '../../models/design-item.model';
import { ExternalLink, LucideAngularModule, ArrowUpRight, X, Filter, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-angular';

@Component({
  selector: 'app-design',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './design.html',
  styleUrl: './design.css'
})
export class DesignComponent implements OnInit, OnDestroy {

  readonly ExternalLink = ExternalLink;
  readonly ArrowUpRight = ArrowUpRight;
  readonly X = X;
  readonly Filter = Filter;
  readonly ChevronDown = ChevronDown;
  readonly ChevronRight = ChevronRight;
  readonly ChevronLeft = ChevronLeft;

  images: DesignItem[] = DESIGN_IMAGES;
  filteredImages: DesignItem[] = DESIGN_IMAGES;

  // Propriétés pour les filtres
  availableTags: string[] = [];
  availableProjects: string[] = [];
  selectedTags: string[] = [];
  selectedProjects: string[] = [];
  showFilters = false;
  showTags = false;
  showProjects = false;
  mobileFiltersOpen = false;

  // Propriétés pour la modal
  selectedConcept: DesignItem | null = null;
  selectedImage: { url: string; alt?: string; description?: string } | null = null;
  showModal = false;


  angle = 0;
  private rotationSpeed = 0;
  private radiusX = 400;
  private radiusY = 1000;
  private minScale = 0.2;
  private maxScale = 1;
  private imageWidth = 400;
  private imageHeight = 80;
  private pauseDuration = 2000;

  // Variables d'animation améliorées
  private currentSpeed = 0.4;
  private targetSpeed = 0.4;
  private animationFrameId: number = 0;
  private lastTimestamp: number = 0;

  // États de contrôle
  private isPaused = false;
  private isUserHovering = false;
  private pauseTimeout: any = null;
  private lastPauseAngle = -1; // pour éviter les pauses répétitives
  private centeredImageIndex = -1; // index de l'image actuellement centrée

  // Paramètres de transition améliorés
  private readonly SPEED_TRANSITION = 0.03; // transition ultra-fluide
  private readonly PAUSE_DETECTION_ANGLE = 300;
  private readonly PAUSE_TOLERANCE = 1.0;
  private readonly MIN_SPEED_THRESHOLD = 0.005;
  private readonly CENTER_ANGLE = 180; // angle de référence pour le centre
  currentImageIndex = 0;

  nextImage() {
    if (!this.selectedConcept) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.selectedConcept.images.length;
    this.selectedImage = this.selectedConcept.images[this.currentImageIndex];
  }

  prevImage() {
    if (!this.selectedConcept) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.selectedConcept.images.length) % this.selectedConcept.images.length;
    this.selectedImage = this.selectedConcept.images[this.currentImageIndex];
  }
  ngOnInit() {
    this.initializeFilters();
    this.startRotation();
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private initializeFilters() {
    // Extraire tous les tags et projets uniques
    const tags = new Set<string>();
    const projects = new Set<string>();

    this.images.forEach(image => {
      if (image.tags) {
        image.tags.forEach(tag => tags.add(tag));
      }
      if (image.categories) {
        image.categories.forEach(category => projects.add(category));
      }
    });

    this.availableTags = Array.from(tags).sort();
    this.availableProjects = Array.from(projects).sort();
  }

  // Méthodes pour les filtres
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  toggleTag(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
    }
    this.applyFilters();
  }

  toggleProject(project: string) {
    const index = this.selectedProjects.indexOf(project);
    if (index > -1) {
      this.selectedProjects.splice(index, 1);
    } else {
      this.selectedProjects.push(project);
    }
    this.applyFilters();
  }

  clearAllFilters() {
    this.selectedTags = [];
    this.selectedProjects = [];
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredImages = this.images.filter(image => {
      const tagMatch = this.selectedTags.length === 0 || (image.tags && image.tags.some(tag => this.selectedTags.includes(tag)));
      const projectMatch = this.selectedProjects.length === 0 || (image.categories && image.categories.some(category => this.selectedProjects.includes(category)));
      return tagMatch && projectMatch;
    });

    // Réinitialiser l'angle si nécessaire
    if (this.filteredImages.length !== this.images.length) {
      this.angle = 0;
      this.lastPauseAngle = -1;
    }
  }

  // Méthodes pour la modal
  openImageModal(concept: DesignItem, image: { url: string; alt?: string; description?: string }) {
    this.selectedConcept = concept;
    this.selectedImage = image;
    this.currentImageIndex = concept.images.findIndex(img => img.url === image.url);
    this.showModal = true;
    this.pause();
  }

  closeImageModal() {
    this.showModal = false;
    this.selectedConcept = null;
    this.selectedImage = null;
    this.resume();
  }

  // Méthode pour empêcher la propagation du clic sur les liens dans la modal
  onModalLinkClick(event: Event) {
    event.stopPropagation();
  }

  private cleanup() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.pauseTimeout) {
      clearTimeout(this.pauseTimeout);
    }
  }

  startRotation() {
    this.cleanup();
    this.lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (!this.lastTimestamp) {
        this.lastTimestamp = timestamp;
      }

      const deltaTime = Math.min(timestamp - this.lastTimestamp, 50); // limite les gros deltas
      this.lastTimestamp = timestamp;

      this.updateSpeed();
      this.updateAngle(deltaTime);
      this.checkForPause();

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private updateSpeed() {
    if (Math.abs(this.currentSpeed - this.targetSpeed) > this.MIN_SPEED_THRESHOLD) {
      const speedDiff = this.targetSpeed - this.currentSpeed;
      this.currentSpeed += speedDiff * this.SPEED_TRANSITION;
    } else {
      this.currentSpeed = this.targetSpeed;
    }
  }

  private updateAngle(deltaTime: number) {
    if (Math.abs(this.currentSpeed) > this.MIN_SPEED_THRESHOLD) {
      // Normalisation temporelle pour 60fps
      this.angle += (this.currentSpeed * deltaTime) / 16.67;
      this.angle = ((this.angle % 360) + 360) % 360; // garde toujours positif
    }

    // Mise à jour de l'image centrée
    this.updateCenteredImage();
  }

  private updateCenteredImage() {
    const total = this.filteredImages.length;
    const step = 360 / total;
    let closestIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < total; i++) {
      const itemAngle = (this.angle + i * step) % 360;
      const distance = Math.abs(itemAngle - this.CENTER_ANGLE);
      const normalizedDistance = Math.min(distance, 360 - distance); // gère le passage 0°/360°

      if (normalizedDistance < minDistance) {
        minDistance = normalizedDistance;
        closestIndex = i;
      }
    }

    this.centeredImageIndex = closestIndex;
  }

  private checkForPause() {
    if (this.isPaused || this.isUserHovering || this.currentSpeed < 0.3) {
      return;
    }

    const total = this.filteredImages.length;
    const step = 360 / total;

    for (let i = 0; i < total; i++) {
      const itemAngle = (this.angle + i * step) % 360;
      const angleDiff = Math.abs(itemAngle - this.PAUSE_DETECTION_ANGLE);

      if (angleDiff < this.PAUSE_TOLERANCE) {
        // Évite les pauses répétitives sur le même élément
        const currentPauseId = Math.floor(this.angle / step);
        if (currentPauseId !== this.lastPauseAngle) {
          this.lastPauseAngle = currentPauseId;
          this.pauseAtTop();
        }
        break;
      }
    }
  }

  private pauseAtTop() {
    this.isPaused = true;
    this.targetSpeed = 0;

    // Programme la reprise
    this.pauseTimeout = setTimeout(() => {
      if (this.isPaused) { // vérification au cas où l'utilisateur interagit
        this.resumeRotation();
      }
    }, this.pauseDuration);
  }

  private resumeRotation() {
    this.isPaused = false;
    this.targetSpeed = this.rotationSpeed;
    this.lastTimestamp = 0; // reset pour éviter les sauts
  }

  getStyle(index: number) {
    const total = this.filteredImages.length;
    const step = 360 / total;
    const currentAngle = (this.angle + index * step) % 360;
    const rad = (currentAngle * Math.PI) / 180;

    // Position elliptique
    const x = Math.cos(rad) * this.radiusX;
    const y = Math.sin(rad) * this.radiusY;

    // Profondeur basée sur la position
    const depth = -Math.cos(rad);
    const depthNormalized = (depth + 1) / 2; // 0 à 1

    // Scale de base selon la profondeur
    const scaleProgress = this.easeOutQuad(depthNormalized);
    const scaleBase = this.minScale + (this.maxScale - this.minScale) * scaleProgress;

    // Application du système hiérarchique
    const centerBonus = this.getCenterBonus(currentAngle);
    const finalScale = scaleBase * centerBonus;

    // Opacité hiérarchique
    const centerOpacityBonus = this.getCenterOpacityBonus(currentAngle);
    const baseOpacity = 0.4 + 0.6 * scaleProgress;
    const opacity = baseOpacity * centerOpacityBonus;

    // Z-index basé sur la taille finale pour l'ordre d'affichage
    const zIndex = Math.floor(finalScale * 1000);

    return {
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${finalScale})`,
      opacity: 1,
      zIndex: zIndex,
      width: `${this.imageWidth}px`,
      height: 'auto'
    };
  }

  getTitleStyle(index: number) {
    const total = this.filteredImages.length;
    const step = 360 / total;
    const currentAngle = (this.angle + index * step) % 360;
    const rad = (currentAngle * Math.PI) / 180;

    const x = Math.cos(rad) * this.radiusX;
    const y = Math.sin(rad) * this.radiusY;
    const depth = -Math.cos(rad);
    const depthNormalized = (depth + 1) / 2;
    const scaleProgress = this.easeOutQuad(depthNormalized);
    const scaleBase = this.minScale + (this.maxScale - this.minScale) * scaleProgress;

    // Application du système hiérarchique (même que les images)
    const centerBonus = this.getCenterBonus(currentAngle);
    const finalScale = scaleBase * centerBonus;

    const centerOpacityBonus = this.getCenterOpacityBonus(currentAngle);
    const baseOpacity = 0.4 + 0.6 * scaleProgress;
    const opacity = baseOpacity * centerOpacityBonus;

    const zIndex = Math.floor(finalScale * 1000) + 1;

    const titleY = y + (this.imageHeight * finalScale) / 2 + 10;

    return {
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${titleY}px)) scale(${finalScale * 0.8})`,
      opacity: opacity,
      zIndex: zIndex
    };
  }

  // Fonctions utilitaires pour les animations
  private easeOutQuad(t: number): number {
    return 1 - (1 - t) * (1 - t);
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Calcul du bonus de scale fluide avec système hiérarchique
  private getCenterBonus(angle: number): number {
    // Distance angulaire au centre (180°)
    let distanceToCenter = Math.abs(angle - this.CENTER_ANGLE);
    // Gère le passage 0°/360°
    distanceToCenter = Math.min(distanceToCenter, 360 - distanceToCenter);

    // Système hiérarchique à 3 niveaux
    if (distanceToCenter <= 15) {
      // NIVEAU 1 : Top (1 seul élément) - Zone très restreinte
      const progress = 1 - (distanceToCenter / 15);
      const smoothProgress = this.easeInOutCubic(progress);
      return 1 + (0.25 * smoothProgress); // Scale de 1.0 à 1.5

    } else if (distanceToCenter <= 45) {
      // NIVEAU 2 : Moyen (2-3 éléments adjacents) - Zone intermédiaire
      const progress = 1 - ((distanceToCenter - 15) / 30);
      const smoothProgress = this.easeInOutCubic(progress);
      return 0.75 + (0.25 * smoothProgress); // Scale de 0.75 à 1.0

    } else if (distanceToCenter <= 60) {
      // Transition douce entre 0.75 et 0.5
      const progress = 1 - ((distanceToCenter - 45) / 15);
      const smoothProgress = this.easeInOutCubic(progress);
      return 0.5 + (0.25 * smoothProgress); // de 0.75 à 0.5
    } else {
      return 0.5;
    }
  }

  // Calcul du bonus d'opacité avec système hiérarchique
  private getCenterOpacityBonus(angle: number): number {
    let distanceToCenter = Math.abs(angle - this.CENTER_ANGLE);
    distanceToCenter = Math.min(distanceToCenter, 360 - distanceToCenter);

    // Système hiérarchique d'opacité
    if (distanceToCenter <= 15) {
      // NIVEAU 1 : Très visible
      const progress = 1 - (distanceToCenter / 15);
      const smoothProgress = this.easeInOutCubic(progress);
      return 0.9 + (0.1 * smoothProgress); // Opacité de 0.9 à 1.0

    } else if (distanceToCenter <= 45) {
      // NIVEAU 2 : Moyennement visible
      const progress = 1 - ((distanceToCenter - 15) / 30);
      const smoothProgress = this.easeInOutCubic(progress);
      return 0.6 + (0.3 * smoothProgress); // Opacité de 0.6 à 0.9

    } else {
      // NIVEAU 3 : Peu visible
      return 0.3; // Opacité fixe à 30%
    }
  }

  // Gestion des interactions utilisateur améliorée
  onImageClick(image: DesignItem) {
    if (image.platformUrl) {
      window.open(image.platformUrl, '_blank');
    }
  }

  onMouseEnter() {
    this.isUserHovering = true;
    this.targetSpeed = 0;

    if (this.pauseTimeout) {
      clearTimeout(this.pauseTimeout);
      this.pauseTimeout = null;
    }
  }

  onMouseLeave() {
    this.isUserHovering = false;
    this.isPaused = false;
    this.targetSpeed = this.rotationSpeed;
    this.lastTimestamp = 0;
  }

  // Méthodes de configuration avec validation
  setImageSize(width: number, height: number = 0) {
    this.imageWidth = Math.max(50, Math.min(800, width));
    if (height > 0) {
      this.imageHeight = Math.max(20, Math.min(400, height));
    }
  }

  setScaleRange(min: number, max: number) {
    this.minScale = Math.max(0.1, Math.min(0.8, min));
    this.maxScale = Math.max(this.minScale + 0.2, Math.min(3, max));
  }

  setEllipseSize(radiusX: number, radiusY: number) {
    this.radiusX = Math.max(100, Math.min(500, radiusX));
    this.radiusY = Math.max(200, Math.min(800, radiusY));
  }

  setSpeed(speed: number) {
    this.rotationSpeed = Math.max(0.1, Math.min(3, speed));
    if (!this.isPaused && !this.isUserHovering) {
      this.targetSpeed = this.rotationSpeed;
    }
  }

  setPauseDuration(duration: number) {
    this.pauseDuration = Math.max(500, Math.min(5000, duration));
  }

  // Méthodes de contrôle manuel
  pause() {
    this.isPaused = true;
    this.targetSpeed = 0;
  }

  resume() {
    this.isPaused = false;
    this.isUserHovering = false;
    this.targetSpeed = this.rotationSpeed;
  }

  resetRotation() {
    this.angle = 0;
    this.lastPauseAngle = -1;
  }

  // Méthodes pour accéder à l'image centrée
  getCurrentCenteredImage() {
    return this.centeredImageIndex >= 0 ? this.filteredImages[this.centeredImageIndex] : null;
  }

  getCurrentCenteredIndex(): number {
    return this.centeredImageIndex;
  }

  setSelectedImage(index: number) {
    if (!this.selectedConcept || !this.selectedConcept.images[index]) return;

    this.currentImageIndex = index;
    this.selectedImage = this.selectedConcept.images[index];
  }

}