package com.csr.material;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialUnitTypeDao extends JpaRepository<MaterialUnitType,Integer> {

    public MaterialUnitType findByName(String name);

    public MaterialUnitType findBySymbol(String symbol);

}
