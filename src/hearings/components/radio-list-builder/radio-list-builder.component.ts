import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms';

interface RadioListItem {
  key: string;
  value_en: string;
  child_nodes?: RadioListItem[];
}

@Component({
  selector: 'exui-radio-list-builder',
  templateUrl: './radio-list-builder.component.html',
  styleUrls: ['./radio-list-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioListBuilderComponent {
  @Input() public data: RadioListItem[] = [];
  @Input() public model: RadioListItem[] = [];
  @Output() public modelChange = new EventEmitter<RadioListItem[][]>();

  public formGroup: FormGroup;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      selectedKey: new FormControl(null),
      selectedChildKey: new FormControl(null),
      selectedItems: new FormArray(this.model.map((item) => new FormControl(item)))
    });

    // Emit changes to the model array
    this.formGroup.get('selectedItems')?.valueChanges.subscribe((value) => {
      this.modelChange.emit(value);
    });
  }

  public get selectedItems(): FormArray {
    return this.formGroup.get('selectedItems') as FormArray;
  }

  public onRadioChange(key: string): void {
    this.formGroup.get('selectedKey')?.setValue(key);
    this.formGroup.get('selectedChildKey')?.setValue(null);
  }

  public onDropdownChange(childKey: string): void {
    this.formGroup.get('selectedChildKey')?.setValue(childKey);
  }

  public addToList(): void {
    const selectedKey = this.formGroup.get('selectedKey')?.value;
    const selectedChildKey = this.formGroup.get('selectedChildKey')?.value;
    if (selectedKey) {
      const selectedNode = this.data.find((item) => item.key === selectedKey);
      if (selectedNode) {
        const nodeToAdd = { ...selectedNode, child_nodes: null };
        if (selectedChildKey) {
          const selectedChildNode = selectedNode.child_nodes?.find((child) => child.key === selectedChildKey);
          if (selectedChildNode) {
            nodeToAdd.child_nodes = [selectedChildNode];
          }
        }
        this.selectedItems.push(new FormControl(nodeToAdd));
        this.formGroup.get('selectedKey')?.reset();
        this.formGroup.get('selectedChildKey')?.reset();
      }
    }
  }

  public removeItem(index: number): void {
    this.selectedItems.removeAt(index);
  }

  public get childNodes(): any[] | null {
    const selectedKey = this.formGroup.get('selectedKey')?.value;
    const parentNode = this.data.find((item) => item.key === selectedKey);
    return parentNode?.child_nodes || null;
  }

  public getOptionLabel(option: RadioListItem): string {
    if (option.child_nodes && option.child_nodes.length > 0) {
      return `${option.value_en} - ${option.child_nodes[0].value_en}`;
    }
    return option.value_en;
  }
}
