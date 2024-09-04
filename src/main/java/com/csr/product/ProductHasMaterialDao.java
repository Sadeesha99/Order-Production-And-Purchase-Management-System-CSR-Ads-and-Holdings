package com.csr.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductHasMaterialDao extends JpaRepository<ProductHasMaterial,Integer> {
    @Query("SELECT phm FROM ProductHasMaterial phm where phm.material_id.id=?1")
    public List<ProductHasMaterial> getProductHasMaterialByMatId(Integer materialId);
}
