package com.csr.supplier;


import com.csr.material.Material;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "supplier")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;   //int AI PK
    @Column(name = "supplierno")
    private String supplierno;   //char(14)
    @Column(name = "businessname")
    private String businessname;   //varchar(150)
    @Column(name = "businessemail")
    private String businessemail;   //varchar(150)
    @Column(name = "businesstelephone")
    private String businesstelephone;   //char(10)
    @Column(name = "businessaddress")
    private String businessaddress;   //varchar(250)
    @Column(name = "contact_person_name")
    private String contact_person_name;   //varchar(150)
    @Column(name = "contact_person_mobile")
    private String contact_person_mobile;   //char(10)
    @Column(name = "secondarycontactno")
    private String secondarycontactno;   //char(10)
    @Column(name = "description")
    private String description;   //text
    @Column(name = "added_user_id")
    private Integer added_user_id;   //int
    @Column(name = "updated_user_id")
    private Integer updated_user_id;   //int
    @Column(name = "deleted_user_id")
    private Integer deleted_user_id;   //int
    @Column(name = "added_time")
    private LocalDateTime added_time;   //datetime
    @Column(name = "updated_time")
    private LocalDateTime updated_time;   //datetime
    @Column(name = "deleted_time")
    private LocalDateTime deleted_time;   //datetime
    @ManyToOne
    @JoinColumn(name = "supplier_status_id",referencedColumnName = "id")
    @NotNull
    private SupplierStatus supplier_status_id;

    @ManyToMany // User and Role tables do have many-to-many relationship
    @JoinTable(name = "supplier_has_material" , joinColumns = @JoinColumn(name = "supplier_id"), inverseJoinColumns = @JoinColumn(name = "material_id"))
    private Set<Material> assignedMaterialList;
}
