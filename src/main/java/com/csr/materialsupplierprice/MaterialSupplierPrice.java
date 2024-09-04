package com.csr.materialsupplierprice;

import com.csr.material.Material;
import com.csr.receivedquotation.ReceivedQuotation;
import com.csr.supplier.Supplier;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "material_supplier_price")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaterialSupplierPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK

    @ManyToOne
    @JoinColumn(name = "received_quotation_id", referencedColumnName = "id")
    private ReceivedQuotation received_quotation_id; //int

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id; //int

    @ManyToOne
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material_id; //int

    @Column(name = "best_supplier_price")
    private BigDecimal best_supplier_price; //decimal(10,2)

    @Column(name = "updated_time")
    private LocalDateTime updated_time;  //datetime
    @Column(name = "updated_user_id")
    private Integer updated_user_id;  //int
}
