import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestrictedCaseAccessComponent } from './restricted-case-access.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('RestrictedCaseAccessComponent', () => {
  let component: RestrictedCaseAccessComponent;
  let fixture: ComponentFixture<RestrictedCaseAccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [RestrictedCaseAccessComponent, RpxTranslateMockPipe]
    })
      .compileComponents();
    fixture = TestBed.createComponent(RestrictedCaseAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
