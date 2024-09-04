package com.csr.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.ArrayList;

import com.csr.user.UserDao;
import com.csr.user.UserStatusDao;
import com.csr.role.Role;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserStatusDao userStatusDao;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        com.csr.user.User loggedUserForService = userDao.findByUsername(username);
        com.csr.user.UserStatus userStatusActive = userStatusDao.getReferenceById(1);
        Boolean userStatusBoolean;
        if(loggedUserForService.getUser_status_id().getId() == userStatusActive.getId()){
            userStatusBoolean = true;
        }else{
            userStatusBoolean = false;
        }
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();

        for (Role role : loggedUserForService.getAssignedroles()) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }

        return new User(loggedUserForService.getUsername(), loggedUserForService.getPassword(), userStatusBoolean, true, true, true, authorities);
    }

}