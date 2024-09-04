package com.csr.receivedquotation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReceivedQuotationDao extends JpaRepository<ReceivedQuotation,Integer> {

    @Query(value = "select concat('RQ',lpad(substring(max(rq.received_quot_no),3)+1,5,'0')) as received_quot_no from csroveraller.received_quotation as rq", nativeQuery=true)
    public String getNxtRQNo();

    @Query(value = "select rq from ReceivedQuotation rq where rq.quotation_request_id.id=?1 and rq.received_quotation_status_id.id=1")
    public List<ReceivedQuotation> getRQListByQR(Integer qrID);

    @Query(value = "select rq from ReceivedQuotation rq where rq.received_quotation_status_id.id=1 order by rq.id desc ")
    public List<ReceivedQuotation> getValidRQList();

    @Query(value = "select rq from ReceivedQuotation rq where rq.received_quotation_status_id.id=2 order by rq.id desc ")
    public List<ReceivedQuotation> getInValidRQList();

    //SELECT rq.* FROM csroveraller.received_quotation as rq where rq.id in (SELECT rhasm.received_quotation_id FROM csroveraller.received_quotation_has_material as rhasm where rhasm.material_id=1);
    @Query(value = "select rq from ReceivedQuotation rq where rq.received_quotation_status_id.id=1 and rq.id in (select rhasm.received_quotation_id.id from ReceivedQuotationHasMaterial as rhasm where rhasm.material_id.id=?1)")
    public List<ReceivedQuotation> getValidQRListByMaterailId(Integer MatId);



}
