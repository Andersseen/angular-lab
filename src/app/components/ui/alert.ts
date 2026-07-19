import { Component, computed, input } from '@angular/core';
import { LmnCheckCircleIcon } from 'lumen-icons/check-circle';
import { LmnExclamationTriangleIcon } from 'lumen-icons/exclamation-triangle';
import { LmnInformationCircleIcon } from 'lumen-icons/information-circle';
import { LmnXCircleIcon } from 'lumen-icons/x-circle';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

const CONTAINER_CLASSES: Record<AlertVariant, string> = {
  info: 'border-brand/30 bg-brand/10',
  success: 'border-success/30 bg-success/10',
  warning: 'border-warning/40 bg-warning/10',
  danger: 'border-danger/30 bg-danger/10',
};

const ICON_CLASSES: Record<AlertVariant, string> = {
  info: 'text-brand',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

/**
 * Status banner (info / success / warning / danger). Body text renders in
 * `ink` so it always clears AA on the faint tinted fill; the variant colour is
 * carried by the leading icon. Danger is announced assertively (`role=alert`),
 * the rest politely (`role=status`).
 */
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    LmnInformationCircleIcon,
    LmnCheckCircleIcon,
    LmnExclamationTriangleIcon,
    LmnXCircleIcon,
  ],
  template: `
    <div
      [attr.role]="role()"
      class="flex items-start gap-3 rounded-xl border p-4 text-sm"
      [class]="containerClasses()"
    >
      <span class="mt-0.5 shrink-0" [class]="iconClasses()">
        @switch (variant()) {
          @case ('success') {
            <lmn-check-circle [size]="18" />
          }
          @case ('warning') {
            <lmn-exclamation-triangle [size]="18" />
          }
          @case ('danger') {
            <lmn-x-circle [size]="18" />
          }
          @default {
            <lmn-information-circle [size]="18" />
          }
        }
      </span>
      <div class="min-w-0 text-ink">
        @if (title()) {
          <p class="font-semibold">{{ title() }}</p>
        }
        <div [class.mt-0.5]="title()"><ng-content /></div>
      </div>
    </div>
  `,
})
export class Alert {
  readonly variant = input<AlertVariant>('info');
  readonly title = input<string>();

  readonly role = computed(() => (this.variant() === 'danger' ? 'alert' : 'status'));
  readonly containerClasses = computed(() => CONTAINER_CLASSES[this.variant()]);
  readonly iconClasses = computed(() => ICON_CLASSES[this.variant()]);
}
