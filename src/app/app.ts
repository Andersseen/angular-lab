import { Component } from '@angular/core';
import { Shell } from './components/layout/shell';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Shell],
  template: `<app-shell />`,
})
export class App {}
