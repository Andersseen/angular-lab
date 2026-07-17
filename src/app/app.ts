import { Component, inject } from '@angular/core';
import { Shell } from './components/layout/shell';
import { AnalyticsService } from './core/services/analytics.service';
import { ProgressSyncService } from './core/services/progress-sync.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Shell],
  template: `<app-shell />`,
})
export class App {
  private readonly _theme = inject(ThemeService);
  private readonly _progressSync = inject(ProgressSyncService);
  private readonly _analytics = inject(AnalyticsService);
}
