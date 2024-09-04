package com.csr.customerorderpayment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerOrderPaymentDao extends JpaRepository<CustomerOrderPayment,Integer> {

    @Query(value = "SELECT lpad(substring(max(cop.paymentno),7)+1,4,'0') as nextNo FROM csroveraller.customer_order_payment as cop", nativeQuery=true)
    public String nextPaymentNumber();

    @Query(value = "SELECT substring(max(cop.paymentno),1,6) as nextNo FROM csroveraller.customer_order_payment as cop", nativeQuery=true)
    public String maxPaymentNumber();

    @Query(value = "Select cp From CustomerOrderPayment as cp where cp.customer_order_id.id=?1")
    public List<CustomerOrderPayment> getPaymentsByCOrderId(Integer corderId);

    public CustomerOrderPayment findByPaymentno(String paymentno);

}
