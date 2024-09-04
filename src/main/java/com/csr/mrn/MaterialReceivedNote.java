package com.csr.mrn;

import com.csr.purchaseorder.PurchaseOrder;
import com.csr.purchaseorder.PurchaseOrderHasMaterial;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "material_received_note")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaterialReceivedNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK

    @Column(name = "mrn_no")
    private String mrn_no; //char(15)
    @Column(name = "supplier_invoice_no")
    private String supplier_invoice_no; //varchar(45)
    @ManyToOne
    @JoinColumn(name = "mrn_status_id", referencedColumnName = "id")
    private MaterialReceivedNoteStatus mrn_status_id; //int
    @ManyToOne
    @JoinColumn(name = "purchase_order_id", referencedColumnName = "id")
    private PurchaseOrder purchase_order_id; //int
    @Column(name = "added_user_id")
    private Integer added_user_id; //int
    @Column(name = "updated_user_id")
    private Integer updated_user_id; //int
    @Column(name = "deleted_user_id")
    private Integer deleted_user_id; //int
    @Column(name = "added_time")
    private LocalDateTime added_time; //datetime
    @Column(name = "updated_time")
    private LocalDateTime updated_time; //datetime
    @Column(name = "deleted_time")
    private LocalDateTime deleted_time; //datetime
    @Column(name = "total_bill")
    private BigDecimal total_bill; //decimal(10,2)
    @Column(name = "paid_amount")
    private BigDecimal paid_amount; //decimal(10,2)
    @Column(name = "description")
    private String description; //text
    @OneToMany(mappedBy = "material_received_note_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MaterialReceivedNoteHasMaterial> materialReceivedNoteHasMaterialList;
}
