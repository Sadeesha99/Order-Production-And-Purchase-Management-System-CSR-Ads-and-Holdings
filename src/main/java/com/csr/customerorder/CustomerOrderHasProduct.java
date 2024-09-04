package com.csr.customerorder;

import com.csr.design.Design;
import com.csr.product.Product;
import com.csr.production.Production;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name="customer_order_has_product")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerOrderHasProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;  // int PK

    @ManyToOne
    @JoinColumn(name="customer_order_id", referencedColumnName = "id")
    @JsonIgnore
    private CustomerOrder customer_order_id;  // int

    @ManyToOne
    @JoinColumn(name="product_id", referencedColumnName = "id")
    private Product product_id;  // int

    @ManyToOne
    @JoinColumn(name = "design_id", referencedColumnName = "id")
    private Design design_id;  // int

    @Column(name = "unit_price")
    private BigDecimal unit_price;  // decimal(10,2)

    @Column(name = "quantity")
    private BigDecimal quantity;  // decimal(10,2)

    @Column(name = "line_price")
    private BigDecimal line_price;  // decimal(10,2)

    @ManyToOne
    @JoinColumn(name = "production_id", referencedColumnName = "id")
    private Production production_id;  // int

    @JsonIgnore
    public boolean isDesignEmpty(){
        if (this.design_id == null) {
            return true;
        }else {
            return false;
        }
    }
    @JsonIgnore
    public boolean isDesignIdEmpty(){
        if (this.design_id.getId() == null) {
            return true;
        }else {
            return false;
        }
    }
    @JsonIgnore
    public boolean isDesignFileEmpty(){
        if (this.design_id.getDesign_file() == null) {
            return true;
        }else {
            return false;
        }
    }
}
