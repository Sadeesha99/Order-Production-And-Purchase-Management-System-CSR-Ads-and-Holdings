package com.csr.production;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "production_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductionLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK
    @ManyToOne
    @JoinColumn(name = "production_id", referencedColumnName = "id")
    private Production production_id; //int
    @Column(name = "logged_year")
    private String logged_year; //char(4)
    @Column(name = "logged_month")
    private String logged_month; //char(2)
    @Column(name = "logged_date")
    private String logged_date; //char(2)
    @Column(name = "logged_time")
    private LocalDateTime logged_time; //datetime
    @Column(name = "production_quantity")
    private BigDecimal production_quantity; //decimal(10,2)
    @Column(name = "before_log_quantity")
    private BigDecimal before_log_quantity; //decimal(10,2)
    @Column(name = "after_log_quantity")
    private BigDecimal after_log_quantity; //decimal(10,2)
    @Column(name = "added_user_id")
    private Integer added_user_id; //int
}
