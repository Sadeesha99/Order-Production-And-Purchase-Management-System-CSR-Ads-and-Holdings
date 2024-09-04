package com.csr.design;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "design")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Design {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK

    @Column(name = "designno")
    @NotNull
    private String designno; //varchar(45)

    @Column(name = "name")
    @NotNull
    private String name; //varchar(100)

    @Column(name = "charges")
    @NotNull
    private BigDecimal charges; //decimal(10,2)

    @Column(name = "note")
    private String note; //text

    @Column(name = "design_file")
    private byte[] design_file; //varchar(150)

    @ManyToOne
    @JoinColumn(name = "design_status_id", referencedColumnName = "id")
    private DesignStatus design_status_id; //int


    @Column(name = "added_user_id")
    private Integer added_user_id;  //int

    @Column(name = "added_time")
    private LocalDateTime added_time;  //datetime

    @Column(name = "updated_user_id")
    private Integer updated_user_id;  //int

    @Column(name = "updated_time")
    private LocalDateTime updated_time;  //datetime

    @Column(name = "deleted_user_id")
    private Integer deleted_user_id;  //int

    @Column(name = "deleted_time")
    private LocalDateTime deleted_time;  //datetime

}
