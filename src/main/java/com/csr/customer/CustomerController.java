package com.csr.customer;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.csr.user.UserDao;


@RestController
public class CustomerController {
    @Autowired
    private CustomerDao customerDao;

    @Autowired
    private CustomerStatusDao customerStatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @GetMapping(value = "/customer/findall", produces = "application/json")
    public List<Customer> getALLCustomers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Customer");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return customerDao.getAllCustomersASC();
    }

    @GetMapping(value = "/customer/active", produces = "application/json")
    public List<Customer> getAllActiveCustomers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Customer");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return customerDao.getAllActiveCustomersByDESC();
    }
    @GetMapping(value = "/customer/inactive", produces = "application/json")
    public List<Customer> getAllInActiveCustomers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Customer");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return customerDao.getAllInActiveCustomersByDESC();
    }
    @GetMapping(value = "/customer/deleted", produces = "application/json")
    public List<Customer> getAllDeletedCustomers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Customer");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return customerDao.getAllDeletedCustomersByDESC();
    }


    @GetMapping(value = "/customer/status/findall", produces = "application/json")
    public List<CustomerStatus> getALLCustomerStatus() {
        return customerStatusDao.findAll();
    }

    @GetMapping(value = "/customershavetopay", produces = "application/json")
    public List<Customer> getCustomersDoHaveToPay() {
        return customerDao.customersWithNotCompletedOrder();
    }

    @GetMapping(value = "/customer")
	public ModelAndView customerUI(){
		// Authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Customer");
		if (!loggedUserPrivilege.getSel_privi()) {
			ModelAndView customerModelAndViewError = new ModelAndView();
			customerModelAndViewError.setViewName("error.html");
			return customerModelAndViewError;
		} else {
			ModelAndView customerModelAndView = new ModelAndView();
			customerModelAndView.addObject("title", "Customer Management");
            customerModelAndView.addObject("navbartitle", "CUSTOMER MANAGEMENT MODULE");
            customerModelAndView.addObject("loggeduser", auth.getName());
			customerModelAndView.setViewName("customer.html");
			return customerModelAndView;
		}
	}
    
    @PostMapping(value = "/customer")
    public String postCustomer(@RequestBody Customer customer) {
        // Authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Customer");
		if (!loggedUserPrivilege.getIns_privi()) {
			return "Save did not completed : You dont have the privilege";
		}
        //Checking for existing entry by mobile
        Customer extCustomerByMobile = customerDao.getByMobile(customer.getMobile());
        if(extCustomerByMobile != null){
            return "Save Not Completed : Given " + extCustomerByMobile.getMobile() + "All ready Exist..!";
        }
        try {
            //Generate Next Customer
            String nextCustomer = customerDao.getNextCustomerNo();
            if(nextCustomer==null || nextCustomer.equals("")){
                customer.setCustno("C000001");
            }else{
                customer.setCustno(nextCustomer);
            }
            if(customer.getCustomer_status_id()==null){
                customer.setCustomer_status_id(customerStatusDao.getReferenceById(1));
            }
            customer.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
			// set addedDateTime
			customer.setAdded_time(LocalDateTime.now());
			// call operator
			customerDao.save(customer);
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/customer")
    public String deleteCustomer(@RequestBody Customer customer) {
        // Authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Customer");
		if (!loggedUserPrivilege.getDel_privi()) {
			return "Delete did not completed : You dont have the privilege";
		}
        //Checking for existing entry by id
        Customer extCustomer = customerDao.getReferenceById(customer.getId());
        if(extCustomer == null){
            return "Delete Not Completed : Given customer do not exist..!";
        }
        
        //Checking for existing entry by id
        CustomerStatus delcustomerStatus = customerStatusDao.getReferenceById(3);
        if(extCustomer.getCustomer_status_id().equals(delcustomerStatus)){
            return "Delete Not Completed : Given customer do not exist..!";
        }
        
        try {
            // set deletedUser
            customer.setCustomer_status_id(delcustomerStatus);
            // set delete user id          
            customer.setDeleted_user_id(userDao.findByUsername(auth.getName()).getId());
			// set deletedDateTime
			customer.setDeleted_time(LocalDateTime.now());
            //Save customer
			customerDao.save(customer);
            return "OK";
        } catch (Exception e) {
            return "Save not Completed :" + e.getMessage();
        }
    }

    @PutMapping(value = "/customer")
	public String updateCustomer(@RequestBody Customer customer) {
		// Authentification And Authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Employee");
		if (!loggedUserPrivilege.getUpd_privi()) {
			return "Update did not completed : You dont have the privilege";
		}
		// Checking Existing and duplicate
        //check for existing customer record
        Customer extCustomer = customerDao.getReferenceById(customer.getId());
		if (extCustomer == null) {
			return "Update not completed : Customer not exist..!";
		}
        CustomerStatus delcustomerStatus = customerStatusDao.getReferenceById(3);
        if(!Objects.equals(extCustomer.getCustomer_status_id(), customer.getCustomer_status_id())){
            if(customer.getCustomer_status_id().equals(delcustomerStatus)){
                return "Delete not completed :  It is not allowed to use update customer option for delete..!";
            }
        }

		//Checking for existing entry by mobile
        Customer extCustomerByMobile = customerDao.getByMobile(customer.getMobile());
        if(extCustomerByMobile.getId()!=customer.getId()){
            return "Save Not Completed : Given mobile " + extCustomerByMobile.getMobile() + " all ready has a customer..!";
        }
		try {
            // set auto generated value
			customer.setUpdated_time(LocalDateTime.now());
			customer.setUpdated_user_id(userDao.findByUsername(auth.getName()).getId());
			// operator
			customerDao.save(customer);
			return "OK";
		} catch (Exception e) {
			return "Update not Completed : " + e.getMessage();
		}
	}

    
    
    
}
