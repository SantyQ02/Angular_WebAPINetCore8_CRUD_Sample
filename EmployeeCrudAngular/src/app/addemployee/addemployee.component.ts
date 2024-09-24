import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addemployee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent implements OnInit {
  newEmployee: Employee = new Employee(0, '', '');
  submitBtnText: string = "Create";
  imgLoadingDisplay: string = 'none';

  constructor(private employeeService: EmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const employeeId = params['id'];
      if(employeeId)
      this.editEmployee(employeeId);
    });
  }

  addEmployee(employee: Employee) {
    
    if (!employee.name.trim()) {
      this.toastr.error('No puede haber palabras vacías o solo compuestas por espacios.');
      return;
    }
    
    if (employee.name.length > 100) {
      this.toastr.error('El nombre debe tener menos de 100 caracteres.');
      return;
    }

    if (employee.name.trim().length < 2) {  
      this.toastr.error('El nombre debe tener más de un caracter.');
      return;
    }

    const regex = /\d/;
    if (regex.test(employee.name)) {
      this.toastr.error('El nombre no puede contener números.');
      return;
    }

    const nameParts = employee.name.trim().split(/\s+/); 
    const isValid = nameParts.every(part => part.length >= 2);
    if (nameParts.length === 0 || !isValid) {
      this.toastr.error('Cada parte del nombre debe tener más de un caracter.');
      return;
    }

    // Si todas las validaciones pasan, se crea el empleado
    employee.createdDate = new Date().toISOString();
    this.employeeService.createEmployee(employee).subscribe(result => {
      this.router.navigate(['/']);
    });
  
    this.submitBtnText = "";
    this.imgLoadingDisplay = 'inline';
  }

  editEmployee(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId).subscribe(res => {
      this.newEmployee.id = res.id;
      this.newEmployee.name = res.name
      this.submitBtnText = "Edit";
    });
  }

}
