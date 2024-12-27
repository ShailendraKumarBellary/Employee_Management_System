import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-emp-home',
  templateUrl: './emp-home.component.html',
  styleUrls: ['./emp-home.component.css']
})
export class EmpHomeComponent implements OnInit {

  getEmployeeData: any[] = [];
  employeeForm: FormGroup;
  employeeHeader: string = 'EMPLOYEE MANAGEMENT SYSTEM';
  isEditMode: boolean = false;
  selectedEmployee: any = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      employeeCode: ['', [Validators.required]],
      employeeName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: [true, [Validators.required]], // Male by default
      department: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      basicSalary: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.getEmployeeList();
  }

  getEmployeeList(): void {
    this.employeeService.getEmployees().subscribe((res) => {
      if (res.length >= 1) {
        this.getEmployeeData = res.map(employee => {
          const dearnessAllowance = employee.basicSalary * 0.40;
          const conveyanceAllowance = Math.min(dearnessAllowance * 0.10, 250);
          const houseRentAllowance = Math.max(employee.basicSalary * 0.25, 1500);
          const grossSalary = employee.basicSalary + dearnessAllowance + conveyanceAllowance + houseRentAllowance;

          let pt = 0;
          if (grossSalary <= 3000) {
            pt = 100;
          } else if (grossSalary > 3000 && grossSalary <= 6000) {
            pt = 150;
          } else {
            pt = 200;
          }

          const totalSalary = grossSalary - pt;

          // Return the employee data with the calculated values
          return {
            ...employee,
            dearnessAllowance,
            conveyanceAllowance,
            houseRentAllowance,
            grossSalary,
            pt,
            totalSalary
          };
        });
      } else {
        console.log("No Entries Found!");
      }

      console.log(this.getEmployeeData, 'getEmployeeData');
    });
  }

  onSubmit(): void {

    if (this.isEditMode === true) {
      if (this.employeeForm.valid) {
        const formValues = this.employeeForm.value;

        const updatedEmployee = {
          employeeCode: formValues.employeeCode,
          employeeName: formValues.employeeName,
          dateOfBirth: formValues.dateOfBirth,
          gender: formValues.gender,
          department: formValues.department,
          designation: formValues.designation,
          basicSalary: formValues.basicSalary
        };

        // Call the service to update the employee
        
        this.employeeService.updateEmployee(updatedEmployee).subscribe({
          next: (response) => {
            console.log('Employee updated successfully:', response);
            this.getEmployeeList();  // get the employee list
            this.employeeForm.reset(); // Reset the form
          },
          error: (error) => {
            console.error('Error updating employee:', error);
          }
        });

      }
    }
    
    if (this.employeeForm.valid) {
      const formValues = this.employeeForm.value;
      const backendEmployee = {
        employeeCode: formValues.employeeCode,
        employeeName: formValues.employeeName,
        dateOfBirth: formValues.dateOfBirth,
        gender: formValues.gender,
        department: formValues.department,
        designation: formValues.designation,
        basicSalary: formValues.basicSalary
      };

      // Send data to the backend
      this.employeeService.addEmployee(backendEmployee).subscribe({
        next: async (response) => {
          console.log('Employee added successfully:', response);
          this.getEmployeeList();
          this.employeeForm.reset();
        },
        error: (error) => {
          console.error('Error adding employee:', error);
          this.getEmployeeList();
          this.employeeForm.reset();
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  editEmployee(employee: any): void {
    
    this.isEditMode = true;
    this.selectedEmployee = employee;
    this.employeeForm.patchValue({
      employeeCode: employee.employeeCode,
      employeeName: employee.employeeName,
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender,
      department: employee.department,
      designation: employee.designation,
      basicSalary: employee.basicSalary
    });
  }
}
