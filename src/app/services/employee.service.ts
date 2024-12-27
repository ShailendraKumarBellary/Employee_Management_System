import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'https://localhost:44356/api/Employee';

  constructor(private http: HttpClient) { }

  // Get the Employee List
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add the new Employee 
  addEmployee(employee: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, employee, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Edit the Employee List
  updateEmployee(employee: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${employee.employeeCode}`, employee, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  
}
