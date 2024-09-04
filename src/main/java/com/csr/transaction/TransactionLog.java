package com.csr.transaction;

import com.csr.customerorderpayment.CustomerOrderPayment;
import com.csr.supplierpayment.SupplierPayment;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK
    @Column(name = "logged_year")
    private String logged_year; //char(4)
    @Column(name = "logged_month")
    private String logged_month; //char(2)
    @Column(name = "logged_date")
    private String logged_date; //char(2)
    @Column(name = "logged_time")
    private LocalDateTime logged_time; //datetime
    @Column(name = "added_user_id")
    private Integer added_user_id; //int
    @Column(name = "transaction_amount")
    private BigDecimal transaction_amount; //decimal(10,2)
    @Column(name = "income_type")
    private Boolean income_type; //tinyint

    @ManyToOne
    @JoinColumn(name = "customer_order_payment_id", referencedColumnName = "id")
    private CustomerOrderPayment customer_order_payment_id; //int

    @ManyToOne
    @JoinColumn(name = "supplier_payment_id", referencedColumnName = "id")
    private SupplierPayment supplier_payment_id; //int
}
