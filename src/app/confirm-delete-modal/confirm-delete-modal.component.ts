import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// modal for confirmation of comment/post delete attempts
export class ConfirmDeleteModalComponent {

  @Input() objName;

  constructor(public modal: NgbActiveModal) { }

}
