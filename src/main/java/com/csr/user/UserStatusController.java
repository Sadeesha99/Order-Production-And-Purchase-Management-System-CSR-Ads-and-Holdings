package com.csr.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class UserStatusController {

    @Autowired   
    private UserStatusDao dao;

    @GetMapping(value = "/userstatus/list", produces = "application/json")
    public List<UserStatus> getAllData() {
        return dao.findAllByOrderByIdAsc();
    }
    

}
