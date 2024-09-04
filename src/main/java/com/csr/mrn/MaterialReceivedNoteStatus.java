package com.csr.mrn;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mrn_status")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaterialReceivedNoteStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK
    @Column(name = "name")
    private String name; //varchar(45)

}
