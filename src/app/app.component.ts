import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <img
      appScaleing
      appMovement
      appDragDrop
      class="scale-up movement"
      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
      alt="pikachu"
    />
    <img
      appScaleing
      appMovement
      appDragDrop
      class="scale-up movement"
      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/211.png"
      alt="qwilfish"
    />
  `,
  styles: [
    `
      .scale-up.movement {
        transform: translate(var(--distanceX), var(--distanceY))
          scale(var(--scale));
      }
    `,
  ],
})
export class AppComponent {
  title = "scaleUp";
}
