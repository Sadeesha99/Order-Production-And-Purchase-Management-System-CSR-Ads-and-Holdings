package com.csr.user;

import java.time.LocalDateTime;
import java.util.Set;

import com.csr.employee.Employee;
import com.csr.role.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;  
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")

@Data// generate setter and getter
@NoArgsConstructor //Create default constructors
@AllArgsConstructor// Create All argument constructors

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id; // int AI PK

    @Column(name = "userno")
    @NotNull
    private String userno; // varchar(9)

    @Column(name = "username")
    @NotNull
    private String username; // varchar(150)

    @Column(name = "password")
    @NotNull
    private String password; // varchar(250)

    @Column(name = "email")
    @NotNull
    private String email; // varchar(150)
   
    @Column(name = "note")
    private String note; // text
    
    @Column(name = "added_time")
    @NotNull
    private LocalDateTime added_time; // datetime
    
    @Column(name = "updated_time")
    private LocalDateTime updated_time;// datetime
    
    @Column(name = "deleted_time")
    private LocalDateTime deleted_time; // datetime
    
    @Column(name = "added_user_id")
    private Integer added_user_id; // int
    
    @Column(name = "updated_user_id")
    private Integer updated_user_id;// int
    
    @Column(name = "deleted_user_id")
    private Integer deleted_user_id; // int
    
    @ManyToOne //employee and employeestatus table do have many-to-one relationship
    @JoinColumn(name = "employee_id",referencedColumnName = "id")
    private Employee employee_id;// int

    @ManyToOne //employee and employeestatus table do have many-to-one relationship
    @JoinColumn(name = "user_status_id",referencedColumnName = "id")
    private UserStatus user_status_id;// int

    @ManyToMany // User and Role tables do have many-to-many relationship
    @JoinTable(name = "user_has_role" , joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set <Role> assignedroles;
}
