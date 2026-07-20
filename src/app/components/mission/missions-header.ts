import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { PageHeader } from '../ui/page-header';

@Component({
  selector: 'app-missions-header',
  standalone: true,
  imports: [PageHeader, TranslatePipe, LmnRocketLaunchIcon],
  template: `
    <app-page-header
      [eyebrow]="'missions.eyebrow' | translate"
      [heading]="'missions.heading' | translate"
      [description]="'missions.description' | translate"
    >
      <lmn-rocket-launch data-slot="eyebrow-icon" [size]="12" />
    </app-page-header>
  `,
})
export class MissionsHeader {}
