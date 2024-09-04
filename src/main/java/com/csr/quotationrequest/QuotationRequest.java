package com.csr.quotationrequest;

import com.csr.supplier.Supplier;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "quotation_request")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuotationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK
    @Column(name = "quot_req_no")
    private String quot_req_no; //char(9)
    @Column(name = "required_date")
    private LocalDate required_date; //date
    @Column(name = "added_user_id")
    private Integer added_user_id; //int
    @Column(name = "updated_user_id")
    private Integer updated_user_id; //int
    @Column(name = "deleted_user_id")
    private Integer deleted_user_id; //int
    @Column(name = "added_time")
    private LocalDateTime added_time; //datetime
    @Column(name = "updated_time")
    private LocalDateTime updated_time; //datetime
    @Column(name = "deleted_time")
    private LocalDateTime deleted_time; //
    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id; //int
    @ManyToOne
    @JoinColumn(name = "quotation_request_status_id", referencedColumnName = "id")
    private QuotationRequestStatus quotation_request_status_id; //int
}
