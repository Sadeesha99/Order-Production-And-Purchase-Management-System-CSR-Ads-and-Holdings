package com.csr.customerorder;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderStatusDao extends JpaRepository<CustomerOrderStatus, Integer>{
}
