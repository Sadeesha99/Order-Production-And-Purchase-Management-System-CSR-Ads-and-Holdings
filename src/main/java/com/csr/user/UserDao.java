package com.csr.user;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserDao extends JpaRepository<User,Integer>{

    //@Query(value = "select u from User u where u.username=?1")
    public User findByUsername(String name);

    @Query(value = "select u from User u where u.employee_id.id=?1")
    public User getByEmlpoyee(Integer id);

    //Creating Next userno using concat, lpad and substring functions with max value.
    //First take u as an alias for table User in the database. Then find max value of u.userno(User.userno - max userno value of User table)
    //Then by substring extract numeric part from the fiveth character
    //After that add 1 to that numeric number and concat user text to it
    @Query(value = "select concat('user',lpad(substring(max(u.userno),5)+1,4,'0')) as userno from csroveraller.user as u", nativeQuery=true) 
    public String getNxtUserNo();


    @Query("select u from User u where ((u.username <> 'Admin')and(u.username<>?1)) order by u.user_status_id.id asc")
    public List<User> listofUsersWithoutAdmin(String loggedUsername);
}
