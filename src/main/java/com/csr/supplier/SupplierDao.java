package com.csr.supplier;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierDao extends JpaRepository<Supplier,Integer> {

    @Query(value = "select concat('SUP',lpad(substring(max(s.supplierno),4)+1,4,'0')) as supplierno from csroveraller.supplier as s", nativeQuery=true)
    public String getNxtSupplierNo();

    public Supplier findByBusinessname(String bname);

    @Query(value = "select S from Supplier as S where S.id not in (select QR.supplier_id.id from QuotationRequest as QR where QR.quotation_request_status_id.id=1)")
    public List<Supplier> getSupplierListWithoutRequestedQuoatation();

    @Query(value = "select S from Supplier as S where S.id in (select MSP.supplier_id.id from MaterialSupplierPrice as MSP)")
    public List<Supplier> getSuppliersWithBestPriceForMaterial();

    @Query(value = "select S from Supplier as S where S.id in (select PO.supplier_id.id from PurchaseOrder as PO where PO.purchase_order_status_id.id=1)")
    public List<Supplier> getSupplierWithValidPO();


}
