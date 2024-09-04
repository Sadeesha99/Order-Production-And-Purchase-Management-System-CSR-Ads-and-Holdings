package com.csr.production;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProductionLogController {
    @Autowired
    private ProductionLogDao productionLogDao;

    @GetMapping(value = "/productionlogs/byproductionid/{id}", produces = "application/json")
    public List<ProductionLog> getProductionListByCorderNO(@PathVariable("id") Integer id) {
        return productionLogDao.getALLProductonLogBy(id);
    }

}
