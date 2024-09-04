package com.csr.product;

import com.csr.material.Material;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "product_has_material")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductHasMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    @JsonIgnore
    private Product product_id; //int

    @ManyToOne
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material_id; //int

    @Column(name = "req_quantity")
    private BigDecimal req_quantity; //decimal(10,2)

    @Column(name = "material_unit_price")
    private BigDecimal material_unit_price; //decimal(10,2)

    @Column(name = "material_line_price")
    private BigDecimal material_line_price; //decimal(10,2)
}
