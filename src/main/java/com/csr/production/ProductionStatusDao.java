package com.csr.production;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductionStatusDao extends JpaRepository<ProductionStatus,Integer> {
}
