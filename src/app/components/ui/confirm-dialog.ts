import {
  Component,
  ElementRef,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { VoltButton } from '@voltui/components';

type ConfirmVariant = 'default' | 'danger';

let dialogCount = 0;

/**
 * Accessible confirmation dialog (replaces `window.confirm` and inline danger
 * confirms). Labelled/described `role="alertdialog"`, Escape and backdrop
 * dismiss, a two-button focus trap, and initial focus on the least destructive
 * action (cancel for danger, confirm otherwise).
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [VoltButton],
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
          (click)="dismiss.emit()"
        ></div>
        <div
          #panel
          role="alertdialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          [attr.aria-describedby]="descId"
          class="relative z-10 w-full max-w-md rounded-2xl border border-line bg-surface-raised p-6 shadow-2xl"
          (keydown.escape)="dismiss.emit()"
          (keydown.tab)="trap($event, false)"
          (keydown.shift.tab)="trap($event, true)"
        >
          <h2 [id]="titleId" class="text-lg font-semibold text-ink">
            {{ title() }}
          </h2>
          <p [id]="descId" class="mt-2 text-sm text-ink-muted">
            {{ message() }}
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <volt-button
              variant="outline"
              [disabled]="busy()"
              (click)="dismiss.emit()"
            >
              {{ cancelLabel() }}
            </volt-button>
            <volt-button
              [variant]="variant() === 'danger' ? 'destructive' : 'solid'"
              [disabled]="busy()"
              (click)="confirm.emit()"
            >
              {{ confirmLabel() }}
            </volt-button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialog {
  readonly open = input<boolean>(false);
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input<string>('Confirm');
  readonly cancelLabel = input<string>('Cancel');
  readonly variant = input<ConfirmVariant>('default');
  readonly busy = input<boolean>(false);

  readonly confirm = output<void>();
  readonly dismiss = output<void>();

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  private readonly id = ++dialogCount;
  readonly titleId = `confirm-dialog-title-${this.id}`;
  readonly descId = `confirm-dialog-desc-${this.id}`;

  constructor() {
    effect(() => {
      const panel = this.panel()?.nativeElement;
      if (!this.open() || !panel) {
        return;
      }
      const buttons = this.focusableButtons(panel);
      const target =
        this.variant() === 'danger' ? buttons[0] : buttons[buttons.length - 1];
      target?.focus();
    });
  }

  trap(event: Event, backward: boolean): void {
    const panel = this.panel()?.nativeElement;
    if (!panel) {
      return;
    }
    const buttons = this.focusableButtons(panel);
    if (buttons.length === 0) {
      return;
    }
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    const active = document.activeElement;
    if (backward && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!backward && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusableButtons(panel: HTMLElement): HTMLButtonElement[] {
    return Array.from(panel.querySelectorAll('button')).filter(
      (button) => !button.disabled
    );
  }
}
