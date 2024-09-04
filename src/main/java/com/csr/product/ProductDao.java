package com.csr.product;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductDao extends JpaRepository<Product,Integer> {
    @Query(value = "SELECT p FROM Product p order by p.product_status_id.id asc")
    public List<Product> getAllAsc();

    public Product findByName(String name);

    @Query(value = "select concat('P',lpad(substring(max(p.productno),5)+1,5,'0')) as productno from csroveraller.product as p;", nativeQuery = true)
    public String getNextProductNo();

    @Query(value = "SELECT P FROM Product P where P.id in (SELECT phm.product_id.id FROM ProductHasMaterial phm where phm.material_id.id=?1)")
    public List<Product> getProductListByMaterial(Integer materialId);

    @Query(value = "SELECT P FROM Product P where P.id in (SELECT pr.product_id.id from Production as pr where pr.production_status_id.id=1 or pr.production_status_id.id=2 or pr.production_status_id.id=3)")
    public List<Product> getProductsInProduction();


}
