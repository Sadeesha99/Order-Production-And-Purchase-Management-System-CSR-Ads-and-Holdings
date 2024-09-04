package com.csr.material;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MaterialInventoryLogController {
    @Autowired
    private MaterialInventoryLogDao materialInventoryLogDao;

    @GetMapping(value = "/inventorylogs/byproductionid/{id}", produces = "application/json")
    public List<MaterialInventoryLog> getMaterialnventoryLogByPid(@PathVariable("id") Integer id) {
        return materialInventoryLogDao.getALLInventoryLogByPid(id);
    }
}
