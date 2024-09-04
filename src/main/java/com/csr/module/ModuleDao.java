package com.csr.module;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ModuleDao extends JpaRepository<Module, Integer> {

    //select m.* from csroveraller.module m where m.id not in (SELECT p.module_id FROM csroveraller.privilege p where p.role_id != (SELECT r.id FROM csroveraller.role r where r.name = 'General Manager'));
    @Query("SELECT m from Module m where m.id not in (Select p.module_id.id from Privilege p where p.role_id.id=?1)")
    List<Module> getModulesWithoutPrivilege(Integer roleId);
}
