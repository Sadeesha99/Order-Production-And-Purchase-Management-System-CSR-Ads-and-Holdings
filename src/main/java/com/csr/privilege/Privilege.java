package com.csr.privilege;

import com.csr.module.Module;
import com.csr.role.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "privilege")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Privilege {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true)
    private Integer id; // int AI PK 
    @Column(name="sel")
    private Boolean sel_privi; //tinyint 
    @Column(name="ins")
    private Boolean ins_privi; //tinyint 
    @Column(name="upd")
    private Boolean upd_privi; //tinyint 
    @Column(name="del")
    private Boolean del_privi; //tinyint

    @ManyToOne //Privilege and role table do have many to one relationship
    @JoinColumn(name = "role_id",referencedColumnName = "id")
    private Role role_id;    //int 

    @ManyToOne //Privilege and module table do have many to one relationship
    @JoinColumn(name = "module_id",referencedColumnName = "id")
    private Module module_id;   // int

    public Privilege(boolean sel_privi, boolean ins_privi, boolean upd_privi, boolean del_privi){
        this.sel_privi = sel_privi;
        this.ins_privi = ins_privi;
        this.upd_privi = upd_privi;
        this.del_privi = del_privi;
    }
}


