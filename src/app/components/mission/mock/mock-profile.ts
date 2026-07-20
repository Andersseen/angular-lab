import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnUserCircleIcon } from 'lumen-icons/user-circle';

@Component({
  selector: 'app-mock-profile',
  standalone: true,
  imports: [TranslatePipe, LmnUserCircleIcon],
  template: `
    <div class="text-center">
      <div
        class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand text-2xl font-bold text-al-brand-ink shadow-lg"
      >
        <lmn-user-circle [size]="32" />
      </div>
      <p class="mt-4 text-lg font-semibold text-al-ink">
        {{ 'mission.mock.profile.userLabel' | translate: { id: userId() } }}
      </p>
      <p class="text-sm text-al-ink-muted">
        {{ 'mission.mock.profile.mockProfilePage' | translate }}
      </p>
    </div>
  `,
})
export class MockProfile {
  readonly userId = input.required<string>();
}
