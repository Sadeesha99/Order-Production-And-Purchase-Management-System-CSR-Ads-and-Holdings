package com.csr.role;

import java.util.List;

import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class RoleController {
    
    @Autowired
    private RoleDao dao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value="/role/listwithoutadmin", produces="application/json")
    public List<Role> getListWitoutAdmin(){
        return dao.listWithoutAdmin();
    }
    @GetMapping(value="/role/listwithprivileges", produces="application/json")
    public List<Role> getListWithPrivileges(){
        return dao.listWithPrivileges();
    }
}
