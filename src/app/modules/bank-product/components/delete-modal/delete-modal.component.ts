import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductVo } from '../../../../shared/vo/product-vo';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {

  @Input() showModal: boolean = false;
  @Input() productToDelete?: ProductVo;
  @Output() confirm = new EventEmitter<ProductVo>();
  @Output() cancel = new EventEmitter<void>();

  /**
   * Emit confirm event
   */
  onConfirm() {
    if (this.productToDelete) {
      this.confirm.emit(this.productToDelete);
    }
  }

  /**
   * Emit cancel event
   */
  onCancel() {
    this.cancel.emit();
  }

}
