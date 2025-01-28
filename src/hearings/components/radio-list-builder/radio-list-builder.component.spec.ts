import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { RadioListBuilderComponent } from '..';

describe('RadioListBuilderComponent', () => {
  let component: RadioListBuilderComponent;
  let fixture: ComponentFixture<RadioListBuilderComponent>;

  const MOCK_DATA = [
    { key: 'item1', value_en: 'Item 1', child_nodes: null },
    {
      key: 'item2',
      value_en: 'Item 2',
      child_nodes: [
        { key: 'child1', value_en: 'Child 1' },
        { key: 'child2', value_en: 'Child 2' }
      ]
    }
  ];

  const MOCK_MODEL = [{ key: 'item1', value_en: 'Item 1' }];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RadioListBuilderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioListBuilderComponent);
    component = fixture.componentInstance;
    component.data = MOCK_DATA;
    component.model = MOCK_MODEL;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with provided model', () => {
    expect(component.formGroup).toBeTruthy();
    expect(component.selectedItems.length).toBe(1);
    expect(component.selectedItems.at(0).value).toEqual(MOCK_MODEL[0]);
  });

  it('should update model on form changes', () => {
    spyOn(component.modelChange, 'emit');
    const newItem = { key: 'item2', value_en: 'Item 2', child_nodes: null };
    component.selectedItems.push(new FormControl(newItem));

    fixture.detectChanges();

    expect(component.modelChange.emit).toHaveBeenCalledWith([
      ...MOCK_MODEL,
      newItem
    ]);
  });

  it('should add selected item to the list', () => {
    component.formGroup.get('selectedKey')?.setValue('item2');
    component.addToList();

    expect(component.selectedItems.length).toBe(2);
    expect(component.selectedItems.at(1).value.key).toBe('item2');
  });

  it('should add selected child node to the list', () => {
    component.formGroup.get('selectedKey')?.setValue('item2');
    component.formGroup.get('selectedChildKey')?.setValue('child1');
    component.addToList();

    expect(component.selectedItems.length).toBe(2);
    const addedItem = component.selectedItems.at(1).value;
    expect(addedItem.key).toBe('item2');
    expect(addedItem.child_nodes[0].key).toBe('child1');
  });

  it('should remove an item from the list', () => {
    component.removeItem(0);

    expect(component.selectedItems.length).toBe(0);
  });

  it('should reset selectedKey and selectedChildKey after adding an item', () => {
    component.formGroup.get('selectedKey')?.setValue('item2');
    component.formGroup.get('selectedChildKey')?.setValue('child1');
    component.addToList();

    expect(component.formGroup.get('selectedKey')?.value).toBeNull();
    expect(component.formGroup.get('selectedChildKey')?.value).toBeNull();
  });

  it('should return child nodes for selected key', () => {
    component.formGroup.get('selectedKey')?.setValue('item2');
    const childNodes = component.childNodes;

    expect(childNodes).toBeTruthy();
    expect(childNodes?.length).toBe(2);
    expect(childNodes?.[0].key).toBe('child1');
  });

  it('should return null for child nodes when no key is selected', () => {
    component.formGroup.get('selectedKey')?.setValue(null);
    expect(component.childNodes).toBeNull();
  });

  it('should format option label correctly', () => {
    const optionWithChild = MOCK_DATA[1];
    const label = component.getOptionLabel(optionWithChild);

    expect(label).toBe('Item 2 - Child 1');
  });

  it('should return option label without child node info if no child nodes exist', () => {
    const optionWithoutChild = MOCK_DATA[0];
    const label = component.getOptionLabel(optionWithoutChild);

    expect(label).toBe('Item 1');
  });
});
