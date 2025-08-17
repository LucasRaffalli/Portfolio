import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
interface EmailRequest {
  email: string;
  subject: string;
  message: string;
}

interface EmailSuccessResponse {
  success: boolean;
}

interface EmailErrorResponse {
  error: string | {
    fieldErrors: {
      email?: string[];
      subject?: string[];
      message?: string[];
    };
    formErrors: string[];
  };
}


@Component({
  selector: 'app-contact',
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  // URL de ton API - à adapter selon ton environnement
  private apiUrl = 'https://clarity-api.up.railway.app/api/mailer/send'; // ou ton URL de production

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(1)]],
      message: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  async onSubmit() {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.submitSuccess = false;

    try {
      const formData: EmailRequest = this.contactForm.value;

      const response = await this.http.post<EmailSuccessResponse>(`${this.apiUrl}`, formData).toPromise();

      if (response?.success) {
        this.submitSuccess = true;
        this.contactForm.reset();

        // Reset le message de succès après 5 secondes
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi:', error);

      if (error.status === 0) {
        this.submitError = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
      } else if (error.status === 400) {
        // Erreur de validation Zod
        const errorData = error.error as EmailErrorResponse;
        if (typeof errorData.error === 'object' && errorData.error.fieldErrors) {
          // Afficher les erreurs spécifiques des champs
          const fieldErrors = errorData.error.fieldErrors;
          let errorMessages: string[] = [];

          if (fieldErrors.email) errorMessages.push(...fieldErrors.email);
          if (fieldErrors.subject) errorMessages.push(...fieldErrors.subject);
          if (fieldErrors.message) errorMessages.push(...fieldErrors.message);

          this.submitError = errorMessages.join(', ') || 'Données invalides';
        } else {
          this.submitError = 'Données invalides';
        }
      } else if (error.status === 500) {
        const errorData = error.error as EmailErrorResponse;
        this.submitError = typeof errorData.error === 'string' ? errorData.error : 'Erreur serveur';
      } else {
        this.submitError = 'Une erreur inattendue est survenue';
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters pour faciliter l'accès aux erreurs dans le template
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }
}
