package com.csr.customerorderpayment;

import com.csr.customerorder.CustomerOrder;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_order_payment")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerOrderPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;  //int AI PK

    @Column(name = "paymentno")
    private String paymentno;  //decimal(10,2)

    @Column(name = "amount")
    private BigDecimal amount;  //decimal(10,2)

    @Column(name = "paid_total")
    private BigDecimal paid_total;  //decimal(10,2)

    @Column(name = "remaining_balance")
    private BigDecimal remaining_balance;  //decimal(10,2)

    @Column(name = "added_user_id")
    private Integer added_user_id;  //int

    @Column(name = "updated_user_id")
    private Integer updated_user_id;  //int

    @Column(name = "deleted_user_id")
    private Integer deleted_user_id;  //int

    @Column(name = "added_time")
    private LocalDateTime added_time;  //datetime

    @Column(name = "updated_time")
    private LocalDateTime updated_time;  //datetime

    @Column(name = "deleted_time")
    private LocalDateTime deleted_time;  //datetime

    @ManyToOne
    @JoinColumn(name = "customer_order_id", referencedColumnName = "id")
    private CustomerOrder customer_order_id;  //int

    @ManyToOne
    @JoinColumn(name = "customer_order_payment_status_id", referencedColumnName = "id")
    private CustomerOrderPaymentStatus customer_order_payment_status_id;  //int
}
