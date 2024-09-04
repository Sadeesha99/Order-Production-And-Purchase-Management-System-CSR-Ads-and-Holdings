package com.csr.supplierpayment;

import com.csr.mrn.MaterialReceivedNote;
import com.csr.supplier.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierPaymentDao extends JpaRepository<SupplierPayment,Integer> {

    @Query(value = "select s from Supplier as s where s.id in(select mrn.purchase_order_id.supplier_id.id from MaterialReceivedNote as mrn where mrn.mrn_status_id.id<>3)")
    List<Supplier> getListValidToSupplierPayment();

    @Query(value = "select mrn from MaterialReceivedNote as mrn where mrn.purchase_order_id.supplier_id.id=?1 and mrn.mrn_status_id.id<>3")
    List<MaterialReceivedNote> getListValidMRNToSupplierPayment(Integer supplierID);

    @Query(value = "SELECT lpad(substring(max(sup.supplier_paymentno),7)+1,3,'0') as nextNo FROM csroveraller.supplier_payment as sup", nativeQuery = true)
    public String nextSupplierPaymentNumber();

    @Query(value = "SELECT substring(max(sup.supplier_paymentno),3,4) as nextNo FROM csroveraller.supplier_payment as sup", nativeQuery = true)
    public String maxSupplierPaymentNumber();


}
