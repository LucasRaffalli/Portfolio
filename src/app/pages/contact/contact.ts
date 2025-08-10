import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const subject = (form.elements.namedItem('subject') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
    // Ici, tu peux ajouter la logique pour envoyer l'email ou afficher les données
    console.log('Email:', email);
    console.log('Sujet:', subject);
    console.log('Message:', message);
    // Optionnel : reset du formulaire
    form.reset();
  }
}
