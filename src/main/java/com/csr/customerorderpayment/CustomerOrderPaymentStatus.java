package com.csr.customerorderpayment;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customer_order_payment_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerOrderPaymentStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id" , unique=true)
    private Integer id;

    @Column(name = "name", unique = true)
    @NotNull
    private String name;
}
