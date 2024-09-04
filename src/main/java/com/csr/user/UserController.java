package com.csr.user;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import com.csr.employee.Employee;
import com.csr.employee.EmployeeDao;
import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;

@RestController
public class UserController{

    @Autowired
    private UserDao dao;

    @Autowired
    private EmployeeDao employeeDao;

    @Autowired
    private UserStatusDao userStatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @GetMapping(value = "/user")
    public ModelAndView userUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "User");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView userModelAndViewError = new ModelAndView();
            userModelAndViewError.setViewName("error.html");
            return userModelAndViewError;
        } else {
            ModelAndView userModelAndView = new ModelAndView();
            userModelAndView.addObject("title", "User Management");
            userModelAndView.addObject("navbartitle", "USER MANAGEMENT MODULE");
            userModelAndView.addObject("loggeduser", auth.getName());
            userModelAndView.setViewName("user.html");
            return userModelAndView;
        }
    }

    @GetMapping(value = "/getuserbyid/{id}", produces = "application/json")
    public User getUserByID(@PathVariable("id") Integer id){
        User getUserByID = dao.getReferenceById(id);
        getUserByID.setPassword(null);
        return getUserByID;
    }

    @GetMapping(value = "/user/findall", produces = "application/json")
    public List<User> getAllDataWithoutAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "User");
        if(!loggedUserPrivilege.getSel_privi()){
            return new ArrayList<>();
        }else {
            return dao.listofUsersWithoutAdmin(auth.getName());
        }

    }

    // Create POST mapping for add new User
    @PostMapping("/user")
    public String saveUser(@RequestBody User user) {
        // Authentication and Authorization for user data input
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "User");
        if (!loggedUserPrivilege.getIns_privi()) {
            return "Save did not completed : You dont have the privilege";
        }
        // Checking for existing similar records
        //
        User extUserByUsername = dao.findByUsername(user.getUsername());
        if (extUserByUsername != null) {
            return ("Save could not complete : Give Username " + user.getUsername() + " already exist.");
        }
        User extUserByEmployeeID = dao.getByEmlpoyee(user.getEmployee_id().getId());
        if (extUserByEmployeeID != null) {
            return ("Save could not complete : Given Employee " + user.getEmployee_id().getFullname()
                    + " already has an account.");
        }

        try {
            // Set Auto generated values
            String nxtUserNumber = dao.getNxtUserNo(); // get next userno
            if (nxtUserNumber == null || nxtUserNumber.equals("")) {
                user.setUserno("user0001");// setting first userno
            } else {
                user.setUserno(nxtUserNumber);
            }
            // Settig Encoded password
            String passWordEncrypt = bCryptPasswordEncoder.encode(user.getPassword());
            user.setPassword(passWordEncrypt);
            // set employee has user account
            Employee employee = employeeDao.getReferenceById(user.getEmployee_id().getId());
            employee.setHasuseraccount(true);
            employeeDao.save(employee);
            // set added time
            user.setAdded_time(LocalDateTime.now());
            // set added_user
            user.setAdded_user_id(dao.findByUsername(auth.getName()).getId());
            // save user to database
            dao.save(user);
            // return feedback 'OK' to front end
            return "OK";
        } catch (Exception e) {
            // Catching Exception errors as e and return to front end
            return ("Save could not complete : " + e.getMessage());
        }
    }

    // Delete Mapping
    @DeleteMapping(value = "/user")
    public String deleteUser(@RequestBody User user) {
        // Authentication and Authorization
        // Authentication and Authorization for user data input
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "User");
        if (!loggedUserPrivilege.getDel_privi()) {
            return "Delete was not successful : You dont have the privilege";
        }
        // Getting Existing Record from database into a extUserbyID varibale
        User extUserbyID = dao.getReferenceById(user.getId());
        if (extUserbyID == null) {
            return "Delete was not successful  : User does not exist..!";
        } else {
            try {
                // Taking Delete Status from database
                UserStatus deletedStatus = userStatusDao.getReferenceById(3);
                // set employee has user account
                Employee employee = employeeDao.getReferenceById(user.getEmployee_id().getId());
                employee.setHasuseraccount(false);
                employeeDao.save(employee);
                // Set DeletedUser Status to ExtUserbyID
                user.setUser_status_id(deletedStatus);
                // Set Deleted User
                user.setDeleted_user_id(dao.findByUsername(auth.getName()).getId());
                // Set Deleted Date and time;
                user.setDeleted_time(LocalDateTime.now());
                // Save employee
                dao.save(user);
                return "OK";
            } catch (Exception e) {
                return ("Delete was not successful :" + e.getMessage());
            }
        }
    }

    @PutMapping(value = "/user")
    public String updateUser(@RequestBody User user) {
        // Authentication and Authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "User");
        if (!loggedUserPrivilege.getUpd_privi()) {
            return "Save could not complete : You dont have the privilege";
        }
        // Checking with Exisiting Records
        User extUserByUserName = dao.findByUsername(user.getUsername());
        // checking whether username empty And Is user_id of exist user with username
        // and user from frontend are same.
        if (extUserByUserName != null && extUserByUserName.getId() != user.getId()) {
            return ("Save could not complete : " + user.getUsername() + " already exist...!");
        }


        try {

            if(user.getUser_status_id().getId()==1){
                Employee employee = employeeDao.getReferenceById(user.getEmployee_id().getId());
                employee.setHasuseraccount(true);
                employeeDao.save(employee);
            }

            // check password changed or not
            User extUser = dao.getReferenceById(user.getId());
            if (user.getPassword()== null) {
                //System.out.println("password did not updated");
                //System.out.println("password : "+user.getPassword());
                //System.out.println("password : "+extUser.getPassword());
                user.setPassword(extUser.getPassword());
            }else {
                //System.out.println("password did updated");
                //System.out.println("password new : "+user.getPassword());
                //System.out.println("password old : "+extUser.getPassword());
                // set encoded password
                String newPassEncrypted = bCryptPasswordEncoder.encode(user.getPassword());
                user.setPassword(newPassEncrypted);
            }
            // set auto generated value
            user.setUpdated_user_id(dao.findByUsername(auth.getName()).getId());
            user.setUpdated_time(LocalDateTime.now());
            // operator
            dao.save(user);

            // dependencies must be set before save.
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : " + e.getMessage();
        }
    }

}
