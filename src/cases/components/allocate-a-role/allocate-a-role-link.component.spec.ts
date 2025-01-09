import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AllocateARoleLinkComponent } from './allocate-a-role-link.component';

describe('AllocateARoleLinkComponent', () => {
  let component: AllocateARoleLinkComponent;
  let fixture: ComponentFixture<AllocateARoleLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllocateARoleLinkComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(AllocateARoleLinkComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call addExistingUsersToQueryParams on ngOnInit', () => {
      // Arrange
      spyOn(component, 'addExistingUsersToQueryParams');

      // Act
      component.ngOnInit();

      // Assert
      expect(component.addExistingUsersToQueryParams).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('should call addExistingUsersToQueryParams on ngOnChanges', () => {
      // Arrange
      spyOn(component, 'addExistingUsersToQueryParams');

      // Act
      component.ngOnChanges();

      // Assert
      expect(component.addExistingUsersToQueryParams).toHaveBeenCalled();
    });
  });

  describe('addExistingUsersToQueryParams', () => {
    it('should set queryParams.existingUsers when existingUsers has values', () => {
      // Arrange
      const existingUsers = ['user1', 'user2'];
      component.existingUsers = existingUsers;

      // Act
      component.ngOnInit();

      // Assert
      const queryParams = component.queryParams;
      expect(queryParams.existingUsers).toEqual(existingUsers.join(','));
    });

    it('should return an empty array when existingUsers is empty', () => {
      // Arrange
      const existingUsers: string[] = [];

      // Act
      const result = component.addExistingUsersToQueryParams(existingUsers);

      // Assert
      const queryParams = component.queryParams;
      expect(queryParams.existingUsers).toBeUndefined();
      expect(result).toEqual([]);
    });

    it('should return an empty array when existingUsers is undefined', () => {
      // Arrange
      const existingUsers: string[] = undefined;

      // Act
      const result = component.addExistingUsersToQueryParams(existingUsers);

      // Assert
      const queryParams = component.queryParams;
      expect(queryParams.existingUsers).toBeUndefined();
      expect(result).toEqual([]);
    });
  });
});
