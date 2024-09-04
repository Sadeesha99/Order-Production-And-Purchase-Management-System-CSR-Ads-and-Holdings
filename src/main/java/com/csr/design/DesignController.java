package com.csr.design;

import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.user.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
public class DesignController {
    @Autowired
    private DesignDao designDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private DesignStatusDao designStatusDao;

    @GetMapping(value = "/design/list", produces = "application/json")
    public List<Design> getAllData() {
        return designDao.findAll();
    }

    public String getNextDesignNo(){
        String nextNumber = designDao.nextDesignNumber();
        String currentMaxYearMonth = designDao.maxDesignNumber();
        String todayYear = ((LocalDateTime.now()).toString().split("T")[0].split("-")[0]).substring(2,4);
        String todayMonth = (LocalDateTime.now()).toString().split("T")[0].split("-")[1];

        String todayYearMonth = todayYear.concat(todayMonth);

        String nextDesignNo = null;

        if(nextNumber == null || currentMaxYearMonth ==null){
            nextDesignNo = ("D"+todayYearMonth+"0001");
        }else {
            if(Integer.parseInt(todayYearMonth)==Integer.parseInt(currentMaxYearMonth)){
                nextDesignNo = ("D"+currentMaxYearMonth+nextNumber);
            }else if(Integer.parseInt(todayYearMonth)>Integer.parseInt(currentMaxYearMonth)){
                nextDesignNo = ("D"+todayYearMonth+"0001");
            }
        }

        return nextDesignNo;
    }

    @PostMapping(value = "/design")
    public String insertDesignRecord(@RequestBody Design design){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Design");
        if (!loggedUserPrivilege.getIns_privi()) {
            return "Design record was not submitted : You don't have the privilege";
        }
        System.out.println(design);
        if(design.getName()==null){
            return "Design record was not submitted : Please add name for design";
        }
        if(design.getCharges()==null){
            return "Design record was not submitted : Please add charges for design";
        }
        Design designExtByName = designDao.findByName(design.getName());
        if(designExtByName!=null){
            return "Please use a unique name for design, Else design files will be not easy to identify..!";
        }
        if(design.getDesign_file()==null){
            if(design.getNote()==null){
                return "Please add a description on design for designer";
            }else{
                design.setDesign_status_id(designStatusDao.getReferenceById(1));
            }
        }else {
            design.setDesign_status_id(designStatusDao.getReferenceById(2));
        }
        try {
            design.setDesignno(getNextDesignNo());
            design.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
            design.setAdded_time(LocalDateTime.now());
            designDao.save(design);
            return "OK";
        }catch (Exception e){
            return "Error : "+(e.getMessage());
        }
    }
}
