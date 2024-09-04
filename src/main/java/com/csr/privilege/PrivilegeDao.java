package com.csr.privilege;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PrivilegeDao extends JpaRepository<Privilege,Integer>{
    
    //Get all data from privilege table order by asc. 
    @Query("SELECT p FROM Privilege p ORDER BY p.role_id.id ASC")
    public List<Privilege> getAllPrivilegesInAscToRole();

    @Query(value = "SELECT bit_or(p.sel) as sel ,bit_or(p.ins) as ins, bit_or(p.upd) as upd, bit_or(p.del) as del FROM csroveraller.privilege p where p.role_id in (SELECT uhr.role_id FROM csroveraller.user_has_role uhr where uhr.user_id =(SELECT u.id FROM csroveraller.user as u where u.username=:username)) and module_id=(SELECT m.id FROM csroveraller.module as m where m.name=:modulename);", nativeQuery = true)
    public String getPrivilegeByUserAndModule(@Param("username") String username, @Param("modulename") String modulename);

    @Query("SELECT p FROM Privilege p where p.role_id.id=?1 and p.module_id.id=?2")
    public Privilege getPrivilegeByRoleAndModule(Integer roleID,Integer moduleID);


}
