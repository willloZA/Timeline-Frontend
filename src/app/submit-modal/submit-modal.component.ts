import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-submit-modal',
  templateUrl: './submit-modal.component.html',
  styleUrls: ['./submit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// modal for unauthenticated users on submit attempts
export class SubmitModalComponent {

  constructor(public modal: NgbActiveModal) { }

}
