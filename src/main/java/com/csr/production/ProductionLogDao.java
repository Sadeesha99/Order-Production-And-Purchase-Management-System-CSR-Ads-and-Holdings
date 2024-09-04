package com.csr.production;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductionLogDao extends JpaRepository<ProductionLog,Integer> {
    //SELECT DISTINCT logged_time FROM csroveraller.production_log;


    @Query(value = "Select P from ProductionLog as P where P.production_id.id=?1")
    List<ProductionLog> getALLProductonLogBy(Integer productionId);
}
