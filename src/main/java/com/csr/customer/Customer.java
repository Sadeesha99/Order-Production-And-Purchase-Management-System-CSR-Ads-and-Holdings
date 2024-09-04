package com.csr.customer;

import java.time.LocalDateTime;

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

@Entity
@Table(name = "customer")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique=true)
    private Integer id; // int AI PK

    @Column(name = "custno")
    @NotNull
    private String custno; // char(14)

    @Column(name = "name")
    @NotNull
    private String name; // varchar(150)

    @Column(name = "mobile")
    @NotNull
    private String mobile; // char(10)

    @Column(name = "secondarycontactno")
    private String secondarycontactno; // char(10)

    @Column(name = "email")
    private String email; // varchar(150)

    @Column(name = "description")
    private String description; // text

    @Column(name = "customertype")
    private String customertype; // varchar(100)

    @Column(name = "businessname")
    private String businessname; // varchar(150)

    @Column(name = "businessemail")
    private String businessemail; // varchar(150)

    @Column(name = "businesstelephone")
    private String businesstelephone; // char(10)

    @Column(name = "businessaddress")
    private String businessaddress; // varchar(250)

    @Column(name = "added_user_id")
    @NotNull
    private Integer added_user_id; // int

    @Column(name = "updated_user_id")
    private Integer updated_user_id; // int

    @Column(name = "deleted_user_id")
    private Integer deleted_user_id; // int

    @Column(name = "added_time")
    @NotNull
    private LocalDateTime added_time; // datetime

    @Column(name = "updated_time")
    private LocalDateTime updated_time; // datetime

    @Column(name = "deleted_time")
    private LocalDateTime deleted_time; // datetime

    @ManyToOne
    @JoinColumn(name = "customer_status_id",referencedColumnName = "id")
    @NotNull
    private CustomerStatus customer_status_id; // int

}
