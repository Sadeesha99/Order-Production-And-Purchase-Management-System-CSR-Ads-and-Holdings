package com.csr.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductStatusDao extends JpaRepository<ProductStatus,Integer> {


}
