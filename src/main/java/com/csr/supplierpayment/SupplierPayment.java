package com.csr.supplierpayment;

import com.csr.mrn.MaterialReceivedNote;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "supplier_payment")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK
    @Column(name = "supplier_paymentno")
    private String supplier_paymentno; //varchar(45)
    @ManyToOne
    @JoinColumn(name = "material_received_note_id", referencedColumnName = "id")
    private MaterialReceivedNote material_received_note_id; //int
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
    @Column(name = "paid_amount")
    private BigDecimal paid_amount; //decimal(10,2)
    @Column(name = "amount")
    private BigDecimal amount; //decimal(10,2)
    @Column(name = "remaining_balance")
    private BigDecimal remaining_balance; //decimal(10,2)
    @Column(name = "payment_receipt")
    private byte[] payment_receipt; //mediumblob
}
