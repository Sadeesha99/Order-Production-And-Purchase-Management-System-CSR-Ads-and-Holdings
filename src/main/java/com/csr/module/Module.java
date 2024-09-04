package com.csr.module;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity  //Convert into persistence entity
@Table(name = "module") //for mapping with employee db table

@Data //generate setter and getter
@NoArgsConstructor //Create default constructors
@AllArgsConstructor //Create All argument constructors
public class Module {
    @Id //pk
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name = "id" , unique = true)
    private Integer id;
    
    @Column(name = "name")
    @NotNull
    private String name;

}
