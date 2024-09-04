package com.csr.production;

import com.csr.design.Design;
import com.csr.product.Product;
import com.csr.product.ProductHasMaterial;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "production")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Production {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK

    @Column(name = "productionno")
    @NotNull
    private String productionno; //varchar(45)

    @Column(name = "corderno")
    @NotNull
    private String corderno; //varchar(45)

    @Column(name = "production_line_note")
    private String production_line_note; //text

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
    @JoinColumn(name = "production_status_id", referencedColumnName = "id")
    private ProductionStatus production_status_id; //int

    @Column(name = "total_quantity")
    private BigDecimal total_quantity; // decimal(10,2)

    @Column(name = "current_quantity")
    private BigDecimal current_quantity; // decimal(10,2)

    @Column(name = "completed_quantity")
    private BigDecimal completed_quantity; // decimal(10,2)

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName =  "id")
    private Product product_id; //int

    @ManyToOne
    @JoinColumn(name = "design_id", referencedColumnName =  "id")
    private Design design_id; //int

    @OneToMany(mappedBy = "production_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductionHasMaterial> productionHasMaterialList;
}
