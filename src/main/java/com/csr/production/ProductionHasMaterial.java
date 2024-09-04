package com.csr.production;

import com.csr.material.Material;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "production_has_material")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductionHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;  //int PK

    @ManyToOne
    @JoinColumn(name = "production_id", referencedColumnName = "id")
    @JsonIgnore
    private Production production_id;  //int

    @ManyToOne
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material_id; //int

    @Column(name = "req_quantity")
    private BigDecimal req_quantity;  //decimal(10,2)

    @Column(name = "available_quantity")
    private BigDecimal available_quantity;  //decimal(10,2)
}
