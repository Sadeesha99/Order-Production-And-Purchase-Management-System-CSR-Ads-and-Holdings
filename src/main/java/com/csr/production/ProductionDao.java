package com.csr.production;

import com.csr.customerorderpayment.CustomerOrderPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductionDao extends JpaRepository<Production,Integer> {
    @Query(value = "SELECT lpad(substring(max(p.productionno),6)+1,4,'0') as nextNo FROM csroveraller.production as p;", nativeQuery=true)
    public String nextProductionNumber();

    @Query(value = "SELECT substring(max(p.productionno),2,4) as nextNo FROM csroveraller.production as p", nativeQuery=true)
    public String maxProductionNumber();

    public Production findByProductionno(String productionNo);

    @Query(value = "Select P From Production as P where P.corderno=?1")
    public List<Production> getProductionByCorderNo(String CorderNo);

    @Query(value = "Select P From Production as P where P.production_status_id.id=1 order by P.id desc")
    public List<Production> getAllWaitingProduction();
    @Query(value = "Select P From Production as P where P.production_status_id.id=2 order by P.id desc")
    public List<Production> getAllConfirmedProduction();
    @Query(value = "Select P From Production as P where P.production_status_id.id=3 order by P.id desc")
    public List<Production> getAllOnProductionProduction();
    @Query(value = "Select P From Production as P where P.production_status_id.id=4 order by P.id desc")
    public List<Production> getAllReadyProduction();
    @Query(value = "Select P From Production as P where P.production_status_id.id=5 order by P.id desc")
    public List<Production> getAllCanceledProduction();
}
