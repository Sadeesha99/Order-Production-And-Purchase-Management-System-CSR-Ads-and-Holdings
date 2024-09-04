package com.csr.mrn;

import com.csr.material.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MaterialReceivedNoteDao extends JpaRepository<MaterialReceivedNote,Integer> {

    @Query(value = "select M from Material as M where M.id in (select POHM.material_id.id from PurchaseOrderHasMaterial as POHM where POHM.purchase_order_id.id=?1)")
    public List<Material> getMaterialListByPOid(Integer porderID);

    @Query(value = "SELECT concat('MRN',lpad(substring(max(mrn.mrn_no),4)+1,5,'0')) as mrn_no FROM csroveraller.material_received_note as mrn;", nativeQuery=true)
    public String getNxtMRNNo();

    @Query(value = "select mrn from MaterialReceivedNote as mrn where mrn.mrn_status_id.id<>3")
    List<MaterialReceivedNote> getListValidMRNToSupplierPayment();
}
