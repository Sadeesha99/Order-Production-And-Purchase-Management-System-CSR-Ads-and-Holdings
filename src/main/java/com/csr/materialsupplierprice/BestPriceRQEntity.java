package com.csr.materialsupplierprice;

import com.csr.material.Material;
import com.csr.quotationrequest.QuotationRequest;
import com.csr.receivedquotation.ReceivedQuotation;
import com.csr.receivedquotation.ReceivedQuotationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BestPriceRQEntity {
    private ReceivedQuotation recieved_quotation_id;
    private QuotationRequest quotation_request_id;
    private LocalDate expire_date;
    private BigDecimal material_unit_price;
    private Material material_id;
}
