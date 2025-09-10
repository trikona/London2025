import { Component } from '@angular/core';

@Component({
  selector: 'whois',
  standalone: true,
  template: `
    <div class="whois-container">
      <h2>Who is traveling?</h2>
      <div class="options">
        <button class="option-btn" (click)="select('Kai')">Kai</button>
        <button class="option-btn" (click)="select('Sofia')">Sofia</button>
        <button class="option-btn" (click)="select('Marc')">Marc</button>
      </div>
      <div *ngIf="selected" class="selected">
        <p>You selected: <strong>{{ selected }}</strong></p>
      </div>
    </div>
  `,
  styles: [`
    .whois-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      background: #f4f8fb;
      border-radius: 1rem;
      box-shadow: 0 4px 16px rgba(0,0,0,0.07);
      padding: 2rem;
    }
    .options {
      display: flex;
      gap: 1.5rem;
      margin: 2rem 0;
    }
    .option-btn {
      padding: 1rem 2rem;
      font-size: 1.2rem;
      border: none;
      border-radius: 0.5rem;
      background: #4f8cff;
      color: #fff;
      cursor: pointer;
      transition: background 0.2s;
    }
    .option-btn:hover {
      background: #2563eb;
    }
    .selected {
      margin-top: 1.5rem;
      font-size: 1.1rem;
      color: #2563eb;
    }
  `]
})
export class WhoisComponent {
  selected: string | null = null;

  select(name: string) {
    this.selected =name;
  }
}