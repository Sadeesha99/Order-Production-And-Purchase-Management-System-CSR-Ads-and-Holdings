package com.csr.customerorder;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderHasProductDao extends JpaRepository<CustomerOrderHasProduct,Integer> {
}
