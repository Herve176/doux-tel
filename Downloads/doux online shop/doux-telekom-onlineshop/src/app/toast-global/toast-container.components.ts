import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../service/services/toast-service';
import { NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgbToastModule, NgTemplateOutlet],
  template: `
    <ng-container *ngFor="let toast of toastService.toasts; trackBy: trackByFn">
      <ngb-toast
        [class]="toast.classname"
        [autohide]="true"
        [delay]="toast.delay || 5000"
        (hidden)="toastService.remove(toast)"
      >
        <ng-template [ngTemplateOutlet]="toast.template"></ng-template>
      </ngb-toast>

    </ng-container>
  `,
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 1200',
  },
})
export class ToastsContainer {
  toastService = inject(ToastService);
}
