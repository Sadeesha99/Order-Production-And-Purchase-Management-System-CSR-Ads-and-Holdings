package com.csr.quotationrequest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuotationRequestDao extends JpaRepository<QuotationRequest,Integer> {
    @Query(value = "select concat('QR',lpad(substring(max(qr.quot_req_no),3)+1,5,'0')) as quot_req_no from csroveraller.quotation_request as qr", nativeQuery=true)
    public String getNxtQRNo();

    @Query(value = "Select qr from QuotationRequest as qr where qr.supplier_id.id=?1 and qr.quotation_request_status_id.id=1")
    public List<QuotationRequest> getRequestQRListBySupplier(Integer supplierID);

    @Query(value = "Select qr from QuotationRequest as qr where qr.supplier_id.id=?1 and qr.quotation_request_status_id.id=2")
    public List<QuotationRequest> getReceivedQRListBySupplier(Integer supplierID);

    @Query(value = "select qr from QuotationRequest as qr where qr.quotation_request_status_id.id=1 order by qr.id desc")
    List<QuotationRequest> getAllQRRequested();

    @Query(value = "select qr from QuotationRequest as qr where qr.quotation_request_status_id.id=2 order by qr.id desc")
    List<QuotationRequest> getAllQRReceived();

    @Query(value = "select qr from QuotationRequest as qr where qr.quotation_request_status_id.id=3 order by qr.id desc")
    List<QuotationRequest> getAllQRInvalid();



}
