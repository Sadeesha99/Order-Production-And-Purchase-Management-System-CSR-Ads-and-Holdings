package com.csr.purchaseorder;

import com.csr.receivedquotation.ReceivedQuotationHasMaterial;
import com.csr.supplier.Supplier;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "purchase_order")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK

    @Column(name = "purchase_order_no")
    private String purchase_order_no; //char(15)

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id; //int;

    @Column(name = "required_date")
    private LocalDate required_date; //date

    @Column(name = "sent_date")
    private LocalDate sent_date; //date

    @Column(name = "total_amount")
    private BigDecimal total_amount; //decimal(10,2)

    @ManyToOne
    @JoinColumn(name = "purchase_order_status_id", referencedColumnName = "id")
    private PurchaseOrderStatus purchase_order_status_id; //int;

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

    @Column(name = "porder_description")
    private String porder_description; //Text

    @OneToMany(mappedBy = "purchase_order_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseOrderHasMaterial> purchaseOrderHasMaterialList;

}
