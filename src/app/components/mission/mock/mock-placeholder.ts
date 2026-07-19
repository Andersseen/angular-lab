import { Component, input } from '@angular/core';

@Component({
  selector: 'app-mock-placeholder',
  standalone: true,
  template: `
    <p class="text-center text-sm text-ink-muted">
      {{ message() }}
    </p>
  `,
})
export class MockPlaceholder {
  readonly message = input.required<string>();
}
