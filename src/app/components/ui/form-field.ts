import { Component, input } from '@angular/core';

/**
 * Label + leading-icon + control + validation-error group for forms. The
 * control itself is projected so reactive-forms bindings stay on the caller's
 * `<input>`; project the leading icon with `data-slot="icon"`. Uses a native
 * `<label for>` so the control is always programmatically associated.
 */
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col gap-2">
      <label [attr.for]="controlId()" class="text-sm font-medium text-al-ink">
        {{ label() }}
      </label>
      <div class="relative">
        <span
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-al-ink-muted"
        >
          <ng-content select="[data-slot=icon]" />
        </span>
        <ng-content />
      </div>
      @if (hint() && !error()) {
        <p class="text-xs text-al-ink-muted">{{ hint() }}</p>
      }
      @if (error()) {
        <p class="text-xs text-al-danger" role="alert">{{ error() }}</p>
      }
    </div>
  `,
})
export class FormField {
  readonly label = input.required<string>();
  readonly controlId = input.required<string>();
  readonly hint = input<string>();
  readonly error = input<string | null>(null);
}
