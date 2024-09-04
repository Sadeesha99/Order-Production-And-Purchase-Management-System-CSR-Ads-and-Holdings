package com.csr.purchaseorder;

import com.csr.material.Material;
import com.csr.materialsupplierprice.MaterialSupplierPrice;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_has_material")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrderHasMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK

    @ManyToOne
    @JoinColumn(name = "purchase_order_id", referencedColumnName = "id")
    @JsonIgnore
    private PurchaseOrder purchase_order_id; //int

    @ManyToOne
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material_id; //int

    @Column(name = "quantity")
    private BigDecimal quantity; //decimal(10,1)

    @Column(name = "quotation_unit_price")
    private BigDecimal quotation_unit_price; //decimal(10,2)

    @Column(name = "quotation_line_price")
    private BigDecimal quotation_line_price; //decimal(10,2)
}
