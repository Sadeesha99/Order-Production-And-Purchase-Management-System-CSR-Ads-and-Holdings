package com.csr.receivedquotation;

import com.csr.quotationrequest.QuotationRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "received_quotation")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceivedQuotation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id; //int AI PK
    @Column(name = "received_quot_no")
    private String received_quot_no; //char(9)
    @Column(name = "expire_date")
    private LocalDate expire_date; //date
    @Column(name = "received_date")
    private LocalDate received_date; //date
    @Column(name = "suppiler_quotation_no")
    private String suppiler_quotation_no; //varchar(45)
    @Column(name = "received_quotation_note")
    private String received_quotation_note; //varchar(150)
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
    private LocalDateTime deleted_time; //datetime
    @ManyToOne
    @JoinColumn(name = "quotation_request_id", referencedColumnName = "id")
    private QuotationRequest quotation_request_id; //int
    @ManyToOne
    @JoinColumn(name = "received_quotation_status_id", referencedColumnName = "id")
    private ReceivedQuotationStatus received_quotation_status_id; //int
    @OneToMany(mappedBy = "received_quotation_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReceivedQuotationHasMaterial> receivedQuotationHasMaterialList;
}
