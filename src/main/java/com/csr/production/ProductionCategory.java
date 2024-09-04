package com.csr.production;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "production_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductionCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id" , unique=true)
    private Integer id;

    @Column(name = "name", unique = true)
    @NotNull
    private String name;
}
