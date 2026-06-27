import { Component, inject } from '@angular/core';
import { Shell } from './components/layout/shell';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Shell],
  template: `<app-shell />`,
})
export class App {
  private readonly _theme = inject(ThemeService);
}
