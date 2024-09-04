package com.csr.production;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductionHasMaterialDao extends JpaRepository<ProductionHasMaterial,Integer> {
}
