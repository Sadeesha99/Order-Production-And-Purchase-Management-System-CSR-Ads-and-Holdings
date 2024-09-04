package com.csr.role;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.csr.privilege.Privilege;

@SuppressWarnings("unused")
public interface RoleDao extends JpaRepository<Role,Integer> {

    @Query("select r from Role r where r.name <> 'Admin'")
    public List<Role> listWithoutAdmin();

    @Query("select r from Role r where r.id in (SELECT p.role_id.id FROM Privilege p) and r.name <> 'Admin'")
    public List<Role> listWithPrivileges();
}
