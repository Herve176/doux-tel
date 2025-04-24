import { Component, inject, OnDestroy, TemplateRef } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastService } from '../service/services/toast-service';
import { ToastsContainer } from './toast-container.components';

@Component({
  selector: 'ngbd-toast-global',
  standalone: true,
  imports: [NgbTooltipModule, ToastsContainer],
  templateUrl: './toast-global.component.html',
  styleUrl: './toast-global.component.css',
})
export class NgbdToastGlobal implements OnDestroy {
  toastService = inject(ToastService);

  showStandard(template: TemplateRef<any>) {
    this.toastService.show({ template });
  }

  showSuccess(template: TemplateRef<any>) {
    this.toastService.show({
      template,
      classname: 'bg-success text-light',
      delay: 10000,
    });
  }

  showDanger(template: TemplateRef<any>) {
    this.toastService.show({
      template,
      classname: 'bg-danger text-light',
      delay: 15000,
    });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
