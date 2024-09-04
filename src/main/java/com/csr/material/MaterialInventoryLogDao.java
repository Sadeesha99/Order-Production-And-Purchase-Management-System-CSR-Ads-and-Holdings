package com.csr.material;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MaterialInventoryLogDao extends JpaRepository<MaterialInventoryLog,Integer> {

    //SELECT DISTINCT logged_time FROM csroveraller.material_inventory_log;
    @Query(value = "Select M from MaterialInventoryLog as M where M.production_id.id=?1")
    List<MaterialInventoryLog> getALLInventoryLogByPid(Integer productionId);

    //Material usage monthly for given period of time
    @Query(value = "SELECT IL.material_id, CONCAT(YEAR(IL.logged_time), '-', MONTHNAME(IL.logged_time)) AS month_year, SUM(CASE WHEN IL.inventory_up = 0 THEN IL.logged_quantity ELSE 0 END) AS materialusage\n" +
            "FROM csroveraller.material_inventory_log AS IL \n" +
            "WHERE  IL.logged_time BETWEEN ?1 AND ?2 \n" +
            "GROUP BY IL.material_id, YEAR(IL.logged_time), MONTH(IL.logged_time)\n" +
            "ORDER BY YEAR(IL.logged_time), MONTH(IL.logged_time);", nativeQuery=true)
    public String[][] getMaterialDownReportBetweenTwoDaysGroupByMonthAndYear(String startDate , String endDate);

    //Material usage daily for given period of time
    @Query(value = "SELECT IL.material_id , date(IL.logged_time) AS datet,  SUM(CASE WHEN IL.inventory_up = 0 THEN IL.logged_quantity ELSE 0 END) AS materialusage\n" +
            "FROM csroveraller.material_inventory_log as IL \n" +
            "where  IL.logged_time between ?1 and ?2 GROUP BY IL.material_id, date(IL.logged_time) ORDER BY date(IL.logged_time)", nativeQuery=true)
    public String[][] getMaterialDownReportBetweenTwoDaysGroupByDay(String startDate , String endDate);



    //Material Purchasing monthly for given period of time
    @Query(value = "SELECT IL.material_id, CONCAT(YEAR(IL.logged_time), '-', MONTHNAME(IL.logged_time)) AS month_year, SUM(CASE WHEN IL.inventory_up = 1 THEN IL.logged_quantity ELSE 0 END) AS materialusage\n" +
            "FROM csroveraller.material_inventory_log AS IL \n" +
            "WHERE  IL.logged_time BETWEEN ?1 AND ?2 \n" +
            "GROUP BY IL.material_id, YEAR(IL.logged_time), MONTH(IL.logged_time)\n" +
            "ORDER BY YEAR(IL.logged_time), MONTH(IL.logged_time);", nativeQuery=true)
    public String[][] getMaterialUPReportBetweenTwoDaysGroupByMonthAndYear(String startDate , String endDate);


    //Given material usage for given period of time
    @Query(value = "SELECT IL.material_id ,  SUM(CASE WHEN IL.inventory_up = 0 THEN IL.logged_quantity ELSE 0 END) AS materialusage\n" +
            "FROM csroveraller.material_inventory_log as IL \n" +
            "where IL.material_id=?1 and  IL.logged_time between ?2 and ?3 GROUP BY IL.material_id ORDER BY IL.material_id", nativeQuery=true)
    public String getGivenMaterialDownForGivenTime(Integer matId, String year , String month);

    @Query(value = "SELECT IL.material_id, CONCAT(YEAR(IL.logged_time), '-', MONTHNAME(IL.logged_time)) AS month_year, SUM(CASE WHEN IL.inventory_up = 1 THEN IL.logged_quantity ELSE 0 END) AS materialusage\n" +
            "FROM csroveraller.material_inventory_log AS IL \n" +
            "WHERE IL.material_id = ?1 AND  IL.logged_time AND YEAR(IL.logged_time)=?2 AND MONTH(IL.logged_time)=?3\n" +
            "GROUP BY IL.material_id, YEAR(IL.logged_time), MONTH(IL.logged_time)\n" +
            "ORDER BY YEAR(IL.logged_time), MONTH(IL.logged_time);", nativeQuery=true)
    public String getGivenMaterialUPReportInGivenMonth(Integer matId, String year , String month);





}
