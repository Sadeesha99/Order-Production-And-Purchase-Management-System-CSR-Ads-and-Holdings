package com.csr.employee;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmployeeDao extends JpaRepository<Employee,Integer>{
    

    // Native Query, HQL, JPQL are supported in Spring Boot
    @Query("SELECT e FROM Employee e where (( e.designation_id.id <> 1) and(e.id <>?1)) ORDER BY e.employee_status_id.id asc ")
    public List<Employee> getAllEmployeesASC(Integer currentUserEmpID);

    @Query("SELECT e FROM Employee e where (( e.designation_id.id <> 1) and(e.id <>?1) and(e.employee_status_id.id=1)) ORDER BY e.id desc")
    public List<Employee> getAllWorkingEmployeesByDESC(Integer currentUserEmpID);

    @Query("SELECT e FROM Employee e where (( e.designation_id.id <> 1) and(e.id <>?1) and(e.employee_status_id.id=2)) ORDER BY e.id desc")
    public List<Employee> getAllResignedEmployeesByDESC(Integer currentUserEmpID);

    @Query("SELECT e FROM Employee e where (( e.designation_id.id <> 1) and(e.id <>?1) and(e.employee_status_id.id=3)) ORDER BY e.id desc")
    public List<Employee> getAllDeletedEmployeesByDESC(Integer currentUserEmpID);

    // get employee by given email
    @Query(value = "Select e from Employee e where e.email=?1")
    public Employee getByEmail(String email);

    // get employee by given nic
    @Query(value = "Select e from Employee e where e.nic=?1")
    public Employee getByNic(String nic);

    // get employee by given nic
    @Query(value = "Select e from Employee e where e.mobile=?1")
    public Employee getByMobile(String mobile);

    // get next employee number
    @Query(value = "select concat('emp',lpad(substring(max(e.empno),4)+1,4,'0')) as empno from csroveraller.employee as e;", nativeQuery = true)
    public String getNextEmpNumber();
    /*
      max(e.empno): Finds the maximum value of the existing employee numbers in the employee table.
      substring(max(e.empno), 4) + 1: Extracts a substring from the fourth character of the maximum employee number and adds 1 to it.
      lpad: Left-pads the result with zeros, ensuring a minimum length of 4 digits.
      concat('emp', ...): Concatenates the string 'emp' with the padded employee number.
     */

     //query for employee list without user accounts
     //SELECT e.id , e.fullname FROM csroveraller.employee as e where e.id not in(SELECT u.employee_id FROM csroveraller.user as u);
    @Query(value = "select e from Employee e where e.id not in (select u.employee_id.id from User u)")
    public List<Employee> getEmployeeListWithoutUserAccount();


    @Query(value = "select E from Employee as E where E.id=(select U.employee_id.id FROM User as U where U.id=?1)")
    public Employee getEmployeeByUserID (Integer userid);

}
