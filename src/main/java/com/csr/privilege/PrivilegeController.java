package com.csr.privilege;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
public class PrivilegeController {

    @Autowired
    private PrivilegeDao privilegeDao;

    @GetMapping(value = "/privilege")
    public ModelAndView privilegeUI() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = getPrivilegeByModule(auth, "Privilege");
		if (!loggedUserPrivilege.getSel_privi()) {
			ModelAndView privilegeModelAndViewError = new ModelAndView();
			privilegeModelAndViewError.setViewName("error.html");
			return privilegeModelAndViewError;
		}else {
			ModelAndView materailModelAndView = new ModelAndView();
			materailModelAndView.addObject("title", "Privilege Management");
			materailModelAndView.addObject("navbartitle", "PRIVILEGE MANAGEMENT MODULE");
			materailModelAndView.addObject("loggeduser", auth.getName());
			materailModelAndView.setViewName("privilege.html");
			return materailModelAndView;
		}
    }

    @GetMapping(value = "/privilege/findall", produces = "application/json")
    public List<Privilege>getAllData(){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege loggedUserPrivilege = getPrivilegeByModule(auth, "Privilege");
		if (!loggedUserPrivilege.getSel_privi()) {
			return new ArrayList<>();
		}else{
			return privilegeDao.getAllPrivilegesInAscToRole();
		}

    }

    @GetMapping(value = "/privilege/role/{roleId}/module/{moduleId}", produces = "application/json")
	public Privilege getPrivilegeByRoleModule(@PathVariable Integer roleId, @PathVariable Integer moduleId) {
		return privilegeDao.getPrivilegeByRoleAndModule(roleId, moduleId);
	}

    @GetMapping(value = "/privilege/bymodule/{modulename}", produces = "application/json")
	public Privilege getPrivilegeByUserModule(@PathVariable("modulename") String modulename) {

		// get logged user authentication object using securitycontextholder
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		return getPrivilegeByModule(auth, modulename);
	}

	public Privilege getPrivilegeByModule(Authentication auth,String modulename){

		if (auth.getName().equals("Admin")) {
			Privilege adminPrivi = new Privilege(true, true, true, true);
			return adminPrivi;
		} else {
			String userPrivilege = privilegeDao.getPrivilegeByUserAndModule(auth.getName(), modulename); // 1,1,1,0
			String[] userPriviArray = userPrivilege.split(","); // [1,1,1,0]
			Boolean select = userPriviArray[0].equals("1");
			Boolean insert = userPriviArray[1].equals("1");
			Boolean update = userPriviArray[2].equals("1");
			Boolean delete = userPriviArray[3].equals("1");
			Privilege userPriv = new Privilege(select, insert, update, delete);
			return userPriv;
		}
	}
    
	@PostMapping(value = "/privilege")
	public String postPrivilege(@RequestBody Privilege privilege) {
		// Authentication and Authorization for user data input
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = getPrivilegeByModule(auth, "Privilege");
        if (!loggedUserPrivilege.getIns_privi()) {
            return "Save did not completed : You dont have the privilege";
        }
        // Checking for existing similar records
        Privilege extPrivilegeRoleId = privilegeDao.getPrivilegeByRoleAndModule(privilege.getRole_id().getId(),privilege.getModule_id().getId());
        if (extPrivilegeRoleId != null) {
            return ("Give Role : "+ privilege.getRole_id().getName() +"already has privileges for module : " + privilege.getModule_id().getName());
        }

		if (privilege.getSel_privi()==false && privilege.getIns_privi()==false && 
		privilege.getUpd_privi()==false && privilege.getDel_privi() == false){
			return("No privileges to enter.");
		}

        try {
            privilegeDao.save(privilege);
            return "OK";
        } catch (Exception e) {
            // Catching Exception errors as e and return to front end
            return ("Save could not complete : " + e.getMessage());
        }
	}

	@DeleteMapping(value = "/privilege")
	public String deletePrivilege(@RequestBody Privilege privilege) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = getPrivilegeByModule(auth, "Privilege");
        if (!loggedUserPrivilege.getDel_privi()) {
            return "Delete was not successful : You dont have the privilege";
        }
		Privilege extPrivilegeRoleId = privilegeDao.getPrivilegeByRoleAndModule(privilege.getRole_id().getId(),privilege.getModule_id().getId());
		if (extPrivilegeRoleId == null) {
            return ("No record in database to delete.");
        }
		try {
			privilegeDao.delete(privilegeDao.getReferenceById(privilege.getId()));
			return "OK";
		} catch (Exception e) {
			return ("Delete was not successful :" + e.getMessage());
		}
	}
	
	@PutMapping(value = "/privilege")
	public String putPrivilege(@RequestBody Privilege privilege) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = getPrivilegeByModule(auth, "Privilege");
        if (!loggedUserPrivilege.getDel_privi()) {
            return "Delete was not successful : You dont have the privilege";
        }
		Privilege extPrivilegeRoleId = privilegeDao.getPrivilegeByRoleAndModule(privilege.getRole_id().getId(),privilege.getModule_id().getId());
		if (extPrivilegeRoleId == null) {
            return ("No record in database to update.");
        }
		if (privilege.getSel_privi()==false && privilege.getIns_privi()==false && 
		privilege.getUpd_privi()==false && privilege.getDel_privi() == false){
			return("No privileges to enter.");
		}
		try{
			privilegeDao.save(privilege);
            return "OK";
		}catch(Exception e){
			return ("Update was not successful :" + e.getMessage());
		}
	}

}
