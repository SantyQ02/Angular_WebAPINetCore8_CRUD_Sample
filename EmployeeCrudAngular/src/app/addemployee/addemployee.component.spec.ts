import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AddemployeeComponent } from './addemployee.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; 
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; 

describe('AddemployeeComponent', () => {
  let component: AddemployeeComponent;
  let fixture: ComponentFixture<AddemployeeComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AddemployeeComponent],
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ id: 1 })
          }
        },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    });

    fixture = TestBed.createComponent(AddemployeeComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error if name has more than 100 characters', () => {
    component.newEmployee.name = 'A'.repeat(101); 
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre debe tener menos de 100 caracteres.');
  });

  it('should display error if name has one character', () => {
    component.newEmployee.name = 'A';
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre debe tener más de un caracter.');
  });

  it('should display error if name has numbers', () => {
    component.newEmployee.name = 'John1 Doe'; 
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre no puede contener números.');
  });

  it('should display error if name is empty', () => {
    component.newEmployee.name = '';
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('No puede haber palabras vacías o solo compuestas por espacios.');
  });

  it('should display error if name is just spaces', () => {
    component.newEmployee.name = '    ';
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('No puede haber palabras vacías o solo compuestas por espacios.');
  });
  
  it('should not display errors for valid name', () => {
    component.newEmployee.name = 'John Doe'; 
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).not.toHaveBeenCalled();
  });
});