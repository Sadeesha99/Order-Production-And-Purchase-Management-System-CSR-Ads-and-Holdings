package com.csr.customerorderpayment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderPaymentStatusDao extends JpaRepository<CustomerOrderPaymentStatus,Integer> {
}
