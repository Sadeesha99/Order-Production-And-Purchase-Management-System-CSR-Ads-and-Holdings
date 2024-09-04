package com.csr.material;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "material")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK
    @Column(name = "matno")
    @NotNull
    private String matno; //char(9)
    @Column(name = "name")
    @NotNull
    private String name; //varchar(149)
    @Column(name = "unit_cost")
    private BigDecimal unit_cost;// decimal(9,2)
    @Column(name = "profit_percentage")
    private BigDecimal profit_percentage; //int
    @Column(name = "descripition")
    private String descripition; //text
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

    @Column(name = "last_intake_date")
    private LocalDateTime last_intake_date; //datetime

    @Column(name = "current_unit_stock")
    private BigDecimal current_unit_stock; //int
    @Column(name = "last_stock_intake")
    private BigDecimal last_stock_intake; //int
    @Column(name = "all_time_total_stock")
    private BigDecimal all_time_total_stock; //int

    @Column(name = "reorder_point")
    private BigDecimal reorder_point; //int

    @Column(name = "reorder_quantity")
    private BigDecimal reorder_quantity; //int


    @ManyToOne
    @JoinColumn(name = "material_category_id", referencedColumnName = "id")
    private MaterialCategory material_category_id; //int
    @ManyToOne
    @JoinColumn(name = "material_unit_type_id", referencedColumnName = "id")
    private MaterialUnitType material_unit_type_id; //int
    @ManyToOne
    @JoinColumn(name = "material_status_id", referencedColumnName = "id")
    private MaterialStatus material_status_id; //int
}
