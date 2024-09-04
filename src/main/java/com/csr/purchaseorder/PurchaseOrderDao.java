package com.csr.purchaseorder;

import com.csr.material.Material;
import com.csr.materialsupplierprice.MaterialSupplierPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseOrderDao extends JpaRepository<PurchaseOrder,Integer> {

    //GetMaterialList In Material Supplier Price
    @Query(value = "select M from Material as M where M.id in (select MSP.material_id.id from MaterialSupplierPrice as MSP where MSP.supplier_id.id=?1)")
    public List<Material> getMaterialListBySupplier(Integer supplierID);

    @Query(value = "select MSP from MaterialSupplierPrice as MSP where MSP.material_id.id=?1")
    public MaterialSupplierPrice getMaterialSupplierPriceOB(Integer materialId);

    @Query(value = "SELECT concat('PO',lpad(substring(max(po.purchase_order_no),3)+1,5,'0')) as purchase_order_no FROM csroveraller.purchase_order as po;", nativeQuery=true)
    public String getNxtPurchaseOrderNo();

    @Query(value = "select PO from PurchaseOrder as PO where PO.purchase_order_status_id.id=1 order by PO.id desc")
    public List<PurchaseOrder> getSendPurchaseOrderList();
    @Query(value = "select PO from PurchaseOrder as PO where PO.purchase_order_status_id.id=2 order by PO.id desc")
    public List<PurchaseOrder> getReceivedPurchaseOrderList();
    @Query(value = "select PO from PurchaseOrder as PO where PO.purchase_order_status_id.id=3 order by PO.id desc")
    public List<PurchaseOrder> getCompletedPurchaseOrderList();
    @Query(value = "select PO from PurchaseOrder as PO where PO.purchase_order_status_id.id=4 order by PO.id desc")
    public List<PurchaseOrder> getCanceledPurchaseOrderList();

    @Query(value = "select PO from PurchaseOrder as PO where PO.purchase_order_status_id.id=1 and PO.supplier_id.id=?1")
    public List<PurchaseOrder> getSendPurchaseOrderListBySupId(Integer supplierID);


}
