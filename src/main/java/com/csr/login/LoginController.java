package com.csr.login;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.csr.employee.Employee;
import com.csr.employee.EmployeeDao;
import com.csr.role.Role;
import com.csr.role.RoleDao;
import com.csr.user.User;
import com.csr.user.UserDao;
import com.csr.user.UserStatus;
import com.csr.user.UserStatusDao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

@SuppressWarnings("unused")
@RestController
public class LoginController {

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserStatusDao userStatusDao;

    @Autowired
    private EmployeeDao employeeDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @GetMapping(value = "/login")
    public ModelAndView loginUI() {
        Authentication authen = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Logged User is : "+authen.getName());
        if (authen instanceof AnonymousAuthenticationToken) {
            //System.out.println("Logged User is Anonymous : "+authen.getName());
            ModelAndView loginView = new ModelAndView();
            loginView.setViewName("login.html");
            return loginView;
        } else {
            //System.out.println("Logged User is Not Anonymous : "+authen.getName());
            return new ModelAndView("redirect:/dashboard");
        }

    }

    @GetMapping(value = "/dashboard")
    public ModelAndView dashboardView() {
        Authentication authenticationDash = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView dashboardView = new ModelAndView();

        dashboardView.setViewName("dashboard.html");
        dashboardView.setViewName("dashboard.html");
        dashboardView.addObject("title", "DashBoard");
        dashboardView.addObject("navbartitle", "DASHBOARD");
        dashboardView.addObject("loggeduser", authenticationDash.getName());
        dashboardView.addObject("loggedEmpName", employeeDao.getEmployeeByUserID(userDao.findByUsername(authenticationDash.getName()).getId()).getFullname());
        return dashboardView;
    }

    @GetMapping(value = "/")
    public ModelAndView dashboardForword() {
        ModelAndView redirectView = new ModelAndView("redirect:/dashboard");
        return redirectView;
    }

    @GetMapping(value = "/error")
    public ModelAndView errorUI() {
        ModelAndView errorView = new ModelAndView();
        errorView.setViewName("error.html");

        return errorView;
    }

    @GetMapping("/createadmin")
    public String createAdmin() {
        // check for current admin users
        User extAdmin = userDao.findByUsername("Admin");
        if (extAdmin != null) {
            try {
                extAdmin.setPassword(bCryptPasswordEncoder.encode("1234"));
                Set<Role> roles = new HashSet<>(); // To create roles set we do create roles hashset
                roles.add(roleDao.getReferenceById(9));
                extAdmin.setAssignedroles(roles);
                userDao.save(extAdmin);
                return "<script>window.location.replace('/login');</script>";

            } catch (Exception e) {
                return "<script>window.location.replace('/error');</script>";
            }

        } else {
            // Create a user instance
            User adminUser = new User();
            // set values for user instance
            adminUser.setUsername("Admin");
            // set useremail
            adminUser.setEmail("admin@email.com");
            // Set Auto generated userno values
            String nxtUserNumber = userDao.getNxtUserNo(); // get next userno
            if (nxtUserNumber.equals(null) || nxtUserNumber.equals("")) {
                adminUser.setUserno("user0001");// setting first userno
            } else {
                adminUser.setUserno(nxtUserNumber);// setting next number generated
            }
            // Taking User Active Status from database through userDao
            adminUser.setUser_status_id(userStatusDao.getReferenceById(1)); // set user status of admin as Active
            adminUser.setAdded_time(LocalDateTime.now()); // set added time to admin
            // Taking Employee Object from database and set with Admin user through
            // employeeDao
            adminUser.setEmployee_id(employeeDao.getReferenceById(1));
            adminUser.setPassword(bCryptPasswordEncoder.encode("1234"));
            // Set Roles for Admin
            // Set is a interface so cannot create an instance of it.
            Set<Role> roles = new HashSet<>(); // To create roles set we do create roles hashset
            roles.add(roleDao.getReferenceById(9));
            adminUser.setAssignedroles(roles);

            userDao.save(adminUser);

            return "<script>window.location.replace('/login');</script>";
        }

    }

}
