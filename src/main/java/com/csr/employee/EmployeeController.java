package com.csr.employee;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.user.User;
import com.csr.user.UserDao;
import com.csr.user.UserStatus;
import com.csr.user.UserStatusDao;

@RestController
public class EmployeeController {

	@Autowired
	private EmployeeDao dao;

	@Autowired
	private EmployeeStatusDao daoStatus;

	@Autowired
	private UserDao daoUser;

	@Autowired
	private UserStatusDao daoUserStatus;

	@Autowired
	private PrivilegeController privilegeController;

	@GetMapping(value = "/employee/findall", produces = "application/json")
	public List<Employee> getAllEmpData() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Employee");
		if (!loggedUserPrivilege.getSel_privi()) {
			return new ArrayList<>();
		}else {
			User loggedUser = daoUser.findByUsername(auth.getName());
			return dao.getAllEmployeesASC(loggedUser.getEmployee_id().getId());
		}
	}

	@GetMapping(value = "/employee/working", produces = "application/json")
	public List<Employee> getAllWorkingEmpData() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Employee");
		if (!loggedUserPrivilege.getSel_privi()) {
			return new ArrayList<>();
		}else {
			User loggedUser = daoUser.findByUsername(auth.getName());
			return dao.getAllWorkingEmployeesByDESC(loggedUser.getEmployee_id().getId());
		}
	}
	@GetMapping(value = "/employee/resign", produces = "application/json")
	public List<Employee> getAllResignEmpData() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Employee");
		if (!loggedUserPrivilege.getSel_privi()) {
			return new ArrayList<>();
		}else {
			User loggedUser = daoUser.findByUsername(auth.getName());
			return dao.getAllResignedEmployeesByDESC(loggedUser.getEmployee_id().getId());
		}
	}

	@GetMapping(value = "/employee/deleted", produces = "application/json")
	public List<Employee> getAllDeletedEmpData() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Employee");
		if (!loggedUserPrivilege.getSel_privi()) {
			return new ArrayList<>();
		}else {
			User loggedUser = daoUser.findByUsername(auth.getName());
			return dao.getAllDeletedEmployeesByDESC(loggedUser.getEmployee_id().getId());
		}
	}

	@GetMapping(value = "/getempbyuserid/{id}", produces = "application/json")
	public Employee getEmployeeByUserID(@PathVariable("id") Integer id){
		return dao.getEmployeeByUserID(id);
	}

	@GetMapping(value = "/employee")
	public ModelAndView employeeUI() {
		// Authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Employee");
		if (!loggedUserPrivilege.getSel_privi()) {
			ModelAndView employeeModelAndViewError = new ModelAndView();
			employeeModelAndViewError.setViewName("error.html");
			return employeeModelAndViewError;
		} else {
			ModelAndView employeeModelAndView = new ModelAndView();
			employeeModelAndView.addObject("title", "Employee Management");
			employeeModelAndView.addObject("navbartitle", "EMPLOYEE MANAGEMENT MODULE");
			employeeModelAndView.addObject("loggeduser", auth.getName());
			employeeModelAndView.setViewName("employee.html");
			return employeeModelAndView;
		}
	}

	@DeleteMapping(value = "/employee")
	public String deleteEmployee(@RequestBody Employee employee) {
		// Authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Employee");
		if (!loggedUserPrivilege.getDel_privi()) {
			return "You dont have the privilege to delete.";
		}
		// Getting Existing Emoloyee from database into a extEmployee varibale
		Employee extEmployee = dao.getReferenceById(employee.getId());
		// checking existing employee
		if (extEmployee == null) {
			return "Delete not completed : Employee not exist..!";
		} else {
			try {
				// Operator
				/* Hard Delete(Hard delete wont be used in the project most of the records) */
				// dao.delete(employee);
				// dao.delete(dao.getReferenceById(employee.getID()));
				// Soft Delete
				EmployeeStatus deleteStatus = daoStatus.getReferenceById(3);
				extEmployee.setEmployee_status_id(deleteStatus);
				extEmployee.setDeleted_user_id(daoUser.findByUsername(auth.getName()).getId());
				extEmployee.setDeleted_time(LocalDateTime.now());
				dao.save(extEmployee); // save extEmployee object (update)
				// Dependance
				User user = daoUser.getByEmlpoyee(employee.getId());
				if (user != null && user.getUser_status_id().getId() == 1) {
					UserStatus userStatus = daoUserStatus.getReferenceById(2);
					user.setUser_status_id(userStatus);
					daoUser.save(user);
				}
				return "OK";
			} catch (Exception e) {
				return "Delete Not Completed : " + e.getMessage();
			}
		}
	}

	@PutMapping(value = "/employee")
	public String updateEmployee(@RequestBody Employee employee) {
		// Authentification And Authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Employee");
		if (!loggedUserPrivilege.getUpd_privi()) {
			return "Update did not completed : You dont have the privilege";
		}
		// Checking Existing and duplicate
		// Getting Existing Emoloyee from database into a extEmployee varibale by id of
		// the employee object that passed from front end
		Employee extEmployee = dao.getReferenceById(employee.getId());
		// checking existing employee
		if (extEmployee == null) {
			return "Update not completed : Employee not exist..!";
		}
		// checking using by email
		Employee extEmployeeByEmail = dao.getByEmail(employee.getEmail());
		if (extEmployeeByEmail != null && extEmployeeByEmail.getId() != employee.getId()) {
			return "Update not Completed : Change " + employee.getEmail() + " already exist..!";
		}
		// checking using nic
		Employee extEmployeeByNic = dao.getByNic(employee.getNic());
		if (extEmployeeByNic != null && extEmployeeByNic.getId() != employee.getId()) {
			return "Update not Completed : Change " + employee.getNic() + " already exist..!";
		}
		Employee exEmployeeByMobile = dao.getByMobile(employee.getMobile());
		if (exEmployeeByMobile != null && exEmployeeByMobile.getId() != employee.getId())
			;

		try {
			// set auto generated value
			employee.setUpdated_time(LocalDateTime.now());
			employee.setUpdated_user_id(daoUser.findByUsername(auth.getName()).getId());
			// operator
			dao.save(employee);

			// dependancies
			if (employee.getEmployee_status_id().getId() == 2) {
				User user = daoUser.getByEmlpoyee(employee.getId());
				if (user != null && user.getUser_status_id().getId() == 1) {
					UserStatus userStatus = daoUserStatus.getReferenceById(2);
					user.setUser_status_id(userStatus);
					daoUser.save(user);
				}
			}
			return "OK";

		} catch (Exception e) {
			return "Update not Completed : " + e.getMessage();
		}
	}

	// Create POST mapping for add new employee
	@PostMapping(value = "/employee")
	public String saveEmployee(@RequestBody Employee employee) { // @RequestBody was used to get data from front end
		// Authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Employee");
		if (!loggedUserPrivilege.getIns_privi()) {
			return "Save did not completed : You dont have the privilege";
		}
		// Checking duplicate
		// Creating Employee Object as extEmployeeEmail and that employee is taken by
		// checking with email that already in system.
		Employee extEmployeeEmail = dao.getByEmail(employee.getEmail());
		if (extEmployeeEmail != null) {
			return "Save Not Completed : Given " + employee.getEmail() + "All ready Exist..!";
		}
		// Creating Employee Object as extEmployeeNIC and that employee is taken by
		// checking with NIC that already in system.
		Employee extEmployeeNic = dao.getByNic(employee.getNic());
		if (extEmployeeNic != null) {
			return "Save Not Completed : Given " + employee.getNic() + "All ready Exist..!";
		}
		// Creating Employee Object as extEmployeeMobile and that employee is taken by
		// checking with Mobile that already in system.
		Employee extEmployeeMobile = dao.getByNic(employee.getMobile());
		if (extEmployeeMobile != null) {
			return "Save Not Completed : Given " + employee.getMobile() + " all ready exist under mobile of "
					+ extEmployeeMobile.getFullname();
		}

		try {
			// set auto generated value
			// employee.setEmpno("emp0002");
			String nxtEmployeeNumber = dao.getNextEmpNumber();
			/*
			 * In here we create next employee number(nxtEmployeeNumber Variable) to
			 * store nextEmployeeNumber form database using getNextEmpNumber function in dao
			 */
			if (nxtEmployeeNumber == null || nxtEmployeeNumber.equals("")) {
				employee.setEmpno("emp0001");
			} else {
				employee.setEmpno(nxtEmployeeNumber);
			}
			// set user account status
			employee.setHasuseraccount(false);
			// set addedUser

			employee.setAdded_user_id(daoUser.findByUsername(auth.getName()).getId());
			// set addedDateTime
			employee.setAdded_time(LocalDateTime.now());
			// call operator
			dao.save(employee);

			return "OK";
		} catch (Exception e) {
			return "Save not Completed :" + e.getMessage();
		}
	}

	// get mapping for get employee without having user account
	// [/employee/nouseraccount]
	@GetMapping(value = "/employee/nouseraccount", produces = "application/json")
	public List<Employee> getEmployeeListWithoutUserAccount() {
		return dao.getEmployeeListWithoutUserAccount();
	}

}
