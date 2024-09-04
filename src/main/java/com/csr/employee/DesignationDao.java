package com.csr.employee;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignationDao extends JpaRepository<Designation, Integer> {
    // You can add custom query methods or other CRUD methods if needed
}
