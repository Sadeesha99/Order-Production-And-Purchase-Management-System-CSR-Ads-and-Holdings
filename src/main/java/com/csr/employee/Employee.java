package com.csr.employee;


import java.time.LocalDateTime;
import java.time.LocalDate;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Making it known as a entity class.
@Table(name = "employee") // This use to map with table
@Data //Generate Setters and Getters
@NoArgsConstructor//Generate Default Constructor
@AllArgsConstructor  //All arguement constructors
public class Employee {
    @Id  // for primery key
    @GeneratedValue(strategy = GenerationType.IDENTITY)   //Auto Increment
    @Column(name = "id" , unique=true)
    private Integer id;

    @Column(name = "empno" , unique=true)
    @NotNull
    @Length(max = 7)
    private String empno;

    @Column(name = "fullname")
    @NotNull
    private String fullname;

    @Column(name = "callingname")
    @NotNull
    private String callingname;

    @Column(name = "nic" , unique=true)
    @NotNull
    @Length(max = 12)
    private String nic;

    @Column(name = "gender")
    @NotNull
    private String gender;

    @Column(name = "dob")
    @NotNull
    private LocalDate dob;

    @Column(name = "mobile" , unique=true)
    @NotNull
    @Length(max = 10)
    private String mobile;

    @Column(name = "land")
    @Length(max = 10)
    private String land;

    @Column(name = "email" , unique=true)
    @NotNull
    private String email;

    @Column(name = "address")
    @NotNull
    private String address;

    @Column(name = "note")
    private String note;

    @Column(name = "civilstatus")
    @NotNull
    private String civilstatus;

    @Column(name = "servicestartdate")
    @NotNull
    private LocalDate servicestartdate;

    @Column(name = "hasuseraccount")
    @NotNull
    private Boolean hasuseraccount;

    @Column(name = "basicsalary")
    @NotNull
    private String basicsalary;

    @Column(name = "employeecategory")
    @NotNull
    private String employeecategory;

    @Column(name = "added_time")
    @NotNull
    private LocalDateTime added_time;

    @Column(name = "updated_time")
    private LocalDateTime updated_time;

    @Column(name = "deleted_time")
    private LocalDateTime deleted_time;

    @Column(name = "added_user_id")
    @NotNull
    private Integer added_user_id;

    @Column(name = "updated_user_id")
    private Integer updated_user_id;

    @Column(name = "deleted_user_id")
    private Integer deleted_user_id;


    @ManyToOne
    @JoinColumn(name = "employee_status_id" , referencedColumnName = "id")
    @NotNull
    private EmployeeStatus employee_status_id;
    
    @ManyToOne
    @JoinColumn(name = "designation_id" , referencedColumnName = "id")
    @NotNull
    private Designation designation_id;

};
