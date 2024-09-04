package com.csr.employee;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DesignationController {

    @Autowired
    private DesignationDao dao;

    @GetMapping(value = "/designation/list", produces = "application/json")
    public List<Designation> getAllData() {
        return dao.findAll();
    }
}
