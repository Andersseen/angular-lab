import { Component, input } from '@angular/core';
import { LmnUserCircleIcon } from 'lumen-icons/user-circle';

@Component({
  selector: 'app-mock-profile',
  standalone: true,
  imports: [LmnUserCircleIcon],
  template: `
    <div class="text-center">
      <div
        class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand text-2xl font-bold text-brand-ink shadow-lg"
      >
        <lmn-user-circle [size]="32" />
      </div>
      <p class="mt-4 text-lg font-semibold text-ink">
        User {{ userId() }}
      </p>
      <p class="text-sm text-ink-muted">Mock profile page</p>
    </div>
  `,
})
export class MockProfile {
  readonly userId = input.required<string>();
}
