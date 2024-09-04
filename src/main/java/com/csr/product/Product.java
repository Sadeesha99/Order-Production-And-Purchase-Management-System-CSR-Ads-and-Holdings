package com.csr.product;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "product")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK
    @Column(name = "productno")
    @NotNull
    private String productno; //varchar(45)
    @Column(name = "name")
    @NotNull
    private String name; //varchar(150)
    @Column(name = "total_price")
    @NotNull
    private BigDecimal total_price; //decimal(10,2)
    @Column(name = "service_charge")
    private BigDecimal service_charge; //decimal(10,2)
    @Column(name = "description")
    private String description; //text
    @Column(name = "added_user_id")
    @NotNull
    private Integer added_user_id; //int
    @Column(name = "updated_user_id")
    private Integer updated_user_id; //int
    @Column(name = "deleted_user_id")
    private Integer deleted_user_id; //int
    @Column(name = "added_time")
    @NotNull
    private LocalDateTime added_time; //datetime
    @Column(name = "updated_time")
    private LocalDateTime updated_time; //datetime
    @Column(name = "deleted_time")
    private LocalDateTime deleted_time; //datetime

    @ManyToOne
    @JoinColumn(name = "product_status_id",referencedColumnName = "id")
    private ProductStatus product_status_id;// int

    @OneToMany(mappedBy = "product_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductHasMaterial> productHasMaterialList;
}
