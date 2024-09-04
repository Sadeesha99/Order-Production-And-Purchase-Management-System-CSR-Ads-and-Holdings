package com.csr.purchaseorder;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "purchase_order_status")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrderStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK
    @Column(name = "name")
    private String name; //varchar(45)
}
