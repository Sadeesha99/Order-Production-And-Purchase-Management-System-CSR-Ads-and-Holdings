package com.csr.materialsupplierprice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Objects;

public interface MaterialSupplierPriceDao extends JpaRepository<MaterialSupplierPrice,Integer> {


    @Query(value = "SELECT MSP from MaterialSupplierPrice as MSP where MSP.material_id.id=?1")
    public MaterialSupplierPrice findByMaterialId(Integer integer);

//    SELECT tb1.id, tb1.quotation_request_id, tb1.received_quotation_status_id, tb1.expire_date, tb2.material_id, tb2.material_unit_price
//    FROM csroveraller.received_quotation as tb1 inner join csroveraller.received_quotation_has_material as tb2 on tb1.id = tb2.received_quotation_id
//    where tb1.received_quotation_status_id =1 and tb2.material_id=4 order by tb2.material_unit_price asc;

    @Query(value = "SELECT tb1.id, tb1.quotation_request_id, tb1.expire_date, tb2.material_id, tb2.material_unit_price \n" +
            "FROM csroveraller.received_quotation as tb1 inner join csroveraller.received_quotation_has_material as tb2 on tb1.id = tb2.received_quotation_id \n" +
            "where tb1.received_quotation_status_id =1 and tb2.material_id=?1 order by tb2.material_unit_price asc;", nativeQuery=true)
    public String[][] joinTableRQAndRQHasM(Integer matid);
    @Query(value = "SELECT tb1.id \n" +
            "FROM csroveraller.received_quotation as tb1 inner join csroveraller.received_quotation_has_material as tb2 on tb1.id = tb2.received_quotation_id \n" +
            "where tb1.received_quotation_status_id =1 and tb2.material_id=?1 order by tb2.material_unit_price asc;", nativeQuery=true)
    public String[][] joinTableRQIDListAndRQHasM(Integer matid);
}
