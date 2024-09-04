package com.csr.receivedquotation;

import com.csr.material.Material;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "received_quotation_has_material")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceivedQuotationHasMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK
    @ManyToOne
    @JoinColumn(name = "received_quotation_id", referencedColumnName = "id")
    @JsonIgnore
    private ReceivedQuotation received_quotation_id; //int
    @ManyToOne
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material_id; //int
    @Column(name = "material_unit_price")
    private BigDecimal material_unit_price; //decimal(10,2)
}
