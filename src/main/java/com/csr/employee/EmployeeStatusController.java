package com.csr.employee;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class EmployeeStatusController {

    @Autowired   
    private EmployeeStatusDao dao;

    @GetMapping(value = "/employeestatus/list", produces = "application/json")
    public List<EmployeeStatus> getAllData() {
        return dao.findAll();
    }
    

}
