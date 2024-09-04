package com.csr.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface UserStatusDao extends JpaRepository<UserStatus, Integer> {
    // You can add custom query methods or other CRUD methods if needed
    public List<UserStatus> findAllByOrderByIdAsc();
}
