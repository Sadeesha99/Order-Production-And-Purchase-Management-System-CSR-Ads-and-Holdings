package com.csr.material;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialCategoryDao extends JpaRepository<MaterialCategory,Integer> {

    public MaterialCategory findByName(String name);

}
