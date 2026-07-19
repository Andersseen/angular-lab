import { Component, computed, input } from '@angular/core';

type IconSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<IconSize, string> = {
  sm: 'h-10 w-10 rounded-xl',
  md: 'h-14 w-14 rounded-2xl',
  lg: 'h-16 w-16 rounded-2xl',
};

/**
 * Rounded electric brand→accent gradient tile that frames a projected icon.
 * Purely presentational; the icon colour uses `text-brand-ink` so it stays
 * legible across the gradient in both themes.
 */
@Component({
  selector: 'app-gradient-icon',
  standalone: true,
  imports: [],
  template: `
    <span
      class="inline-flex items-center justify-center bg-gradient-brand text-brand-ink shadow-lg"
      [class]="sizeClasses()"
    >
      <ng-content />
    </span>
  `,
})
export class GradientIcon {
  readonly size = input<IconSize>('md');
  readonly sizeClasses = computed(() => SIZE_CLASSES[this.size()]);
}
