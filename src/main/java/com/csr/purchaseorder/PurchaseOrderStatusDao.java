package com.csr.purchaseorder;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderStatusDao extends JpaRepository<PurchaseOrderStatus,Integer> {
}
