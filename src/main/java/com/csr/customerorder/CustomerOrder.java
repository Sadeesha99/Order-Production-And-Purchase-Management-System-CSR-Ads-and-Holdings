package com.csr.customerorder;

import com.csr.customer.Customer;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "customer_order")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK

    @NotNull
    @Column(name = "orderno")
    private String orderno; //varchar(20)

    @NotNull
    @Column(name = "required_date")
    private LocalDate required_date; //varchar(45)

    @NotNull
    @Column(name = "total_bill")
    private BigDecimal total_bill; //decimal(10,2)

    @Column(name = "first_payment")
    private BigDecimal first_payment; //decimal(10,2)

    @NotNull
    @Column(name = "remaining_balance")
    private BigDecimal remaining_balance; //decimal(10,2)

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer_id; //int

    @ManyToOne
    @JoinColumn(name = "customer_order_status_id", referencedColumnName = "id")
    private CustomerOrderStatus customer_order_status_id; //int

    @Column(name = "added_user_id")
    @NotNull
    private Integer added_user_id; //int

    @Column(name = "added_time")
    @NotNull
    private LocalDateTime added_time; //datetime

    @Column(name = "updated_user_id")
    private Integer updated_user_id; //int

    @Column(name = "updated_time")
    private LocalDateTime updated_time; //datetime

    @Column(name = "deleted_user_id")
    private Integer deleted_user_id; //int

    @Column(name = "deleted_time")
    private LocalDateTime deleted_time; //datetime

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "customer_order_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CustomerOrderHasProduct> customerOrderHasProductList;


}
