package com.csr.material;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MaterialDao extends JpaRepository<Material,Integer> {

    @Query(value = "Select m from Material m where m.name=?1")
    public Material getByName(String name);
    @Query(value = "select concat('M',lpad(substring(max(mat.matno),5)+1,5,'0')) as matno from csroveraller.material as mat;", nativeQuery = true)
    public String getNextMaterialNo();

    @Query(value = "SELECT m FROM Material m where m.material_status_id.id=4 order by m.id desc")
    public List<Material> getAllMatsLowStockOrderByDesc();

    @Query(value = "SELECT m FROM Material m where m.material_status_id.id=1 order by m.id desc")
    public List<Material> getAllMatsInStockOrderByDesc(); //SELECT m.* FROM csroveraller.material m where m.material_status_id=1 order by m.id desc;

    @Query(value = "SELECT m FROM Material m where m.material_status_id.id=2 order by m.id desc")
    public List<Material> getAllMatsOutStockOrderByDesc();

    @Query(value = "SELECT m FROM Material m where m.material_status_id.id=3 order by m.id desc")
    public List<Material> getAllMatsDelStockOrderByDesc();
    @Query(value = "SELECT m FROM Material m where (m.material_status_id.id=1) and (m.material_category_id.id=?1)")
    public List<Material> getValidMaterialByCategory(Integer categoryId);

    @Query(value = "SELECT m FROM Material m where m.material_status_id.id<>3 order by m.id asc")
    public List<Material> getAllMatsWithoutDel();





}
