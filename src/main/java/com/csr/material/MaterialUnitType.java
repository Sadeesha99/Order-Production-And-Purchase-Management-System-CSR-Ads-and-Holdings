package com.csr.material;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "material_unit_type")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaterialUnitType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true)
    private Integer id; //int AI PK
    @Column(name = "name")
    private String name; //varchar(45)
    @Column(name = "symbol")
    private String symbol; //varchar(20)
}
