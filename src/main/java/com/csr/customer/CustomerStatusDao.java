package com.csr.customer;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerStatusDao extends JpaRepository<CustomerStatus,Integer> {

}
