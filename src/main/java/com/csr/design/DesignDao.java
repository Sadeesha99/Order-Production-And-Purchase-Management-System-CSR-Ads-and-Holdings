package com.csr.design;

import com.csr.production.Production;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DesignDao extends JpaRepository<Design,Integer>{
    @Query(value = "SELECT lpad(substring(max(des.designno),6)+1,4,'0') as nextNo FROM csroveraller.design as des;", nativeQuery=true)
    public String nextDesignNumber();

    @Query(value = "SELECT substring(max(des.designno),2,4) as nextNo FROM csroveraller.design as des;", nativeQuery=true)
    public String maxDesignNumber();

    public Design findByDesignno(String designNo);

    public Design findByName(String designName);

    @Query(value = "Select D From Design as D where D.name=?1")
    public List<Design> designListByDesignName(String designName);
}
