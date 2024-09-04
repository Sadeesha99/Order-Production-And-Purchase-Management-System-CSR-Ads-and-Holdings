package com.csr.mrn;

import com.csr.material.Material;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "material_received_note_has_material")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaterialReceivedNoteHasMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK

    @ManyToOne
    @JoinColumn(name = "material_received_note_id", referencedColumnName = "id")
    @JsonIgnore
    private MaterialReceivedNote material_received_note_id; //int
    @ManyToOne
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material_id; //int
    @Column(name = "quantity")
    private BigDecimal quantity; //decimal(10,1)
    @Column(name = "purchased_unit_price")
    private BigDecimal purchased_unit_price; //decimal(10,2)
    @Column(name = "purchased_line_price")
    private BigDecimal purchased_line_price; //decimal(10,2)
}
