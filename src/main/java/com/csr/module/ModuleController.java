package com.csr.module;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
public class ModuleController {
    
    @Autowired
    public ModuleDao daoModule;
    
    @GetMapping(value = "/module/list",produces = "application/json")
    public List<Module> getAllModules() {
        return daoModule.findAll();
    }
    
    @GetMapping(value = "/modules/withoutprivileges/{roleID}", produces = "application/json")
    public List<Module> getAllModuleWithOutPrivileges(@PathVariable Integer roleID) {
        //int roleIDInteger =  Integer.parseInt(roleID);
        return daoModule.getModulesWithoutPrivilege(roleID);
    }
    
}
