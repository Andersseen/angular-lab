import { Component } from '@angular/core';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { PageHeader } from '../ui/page-header';

@Component({
  selector: 'app-missions-header',
  standalone: true,
  imports: [PageHeader, LmnRocketLaunchIcon],
  template: `
    <app-page-header
      eyebrow="Learning paths"
      heading="Missions"
      description="Pick a mission and learn Angular by writing real code in the browser. No setup required."
    >
      <lmn-rocket-launch data-slot="eyebrow-icon" [size]="12" />
    </app-page-header>
  `,
})
export class MissionsHeader {}
