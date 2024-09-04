package com.csr.customerorder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerOrderDao extends JpaRepository<CustomerOrder, Integer> {

    @Query(value = "SELECT lpad(substring(max(co.orderno),8)+1,4,'0') as nextNo FROM csroveraller.customer_order as co", nativeQuery = true)
    public String nextInvoiceNumber();

    @Query(value = "SELECT substring(max(co.orderno),4,4) as nextNo FROM csroveraller.customer_order as co", nativeQuery = true)
    public String maxInvoiceNumber();

    public CustomerOrder findByOrderno(String orderNo);

    @Query(value = "Select CO From CustomerOrder as CO where CO.customer_order_status_id.id=1 order by CO.id desc")
    public List<CustomerOrder> getAllQueuedCustomerOrder();

    @Query(value = "Select CO From CustomerOrder as CO where CO.customer_order_status_id.id=2 order by CO.id desc")
    public List<CustomerOrder> getAllOnProductionCustomerOrder();

    @Query(value = "Select CO From CustomerOrder as CO where CO.customer_order_status_id.id=3 order by CO.id desc")
    public List<CustomerOrder> getAllReadyCustomerOrder();

    @Query(value = "Select CO From CustomerOrder as CO where CO.customer_order_status_id.id=4 order by CO.id desc")
    public List<CustomerOrder> getAllCompletedCustomerOrder();

    @Query(value = "Select CO From CustomerOrder as CO where CO.customer_order_status_id.id=5 order by CO.id desc")
    public List<CustomerOrder> getAllCanceledCustomerOrder();


    @Query(value = "Select CO From CustomerOrder as CO where CO.customer_id.id=?1 AND CO.customer_order_status_id.id<>5")
    public List<CustomerOrder> getOrdersCustomerID(Integer id);


    //SELECT CONCAT(YEAR(co.added_time), '-', MONTHNAME(co.added_time),'-', day(co.added_time)) AS month_year, dayname(co.added_time) as weekdayname,count(co.id) as numberOFCo FROM csroveraller.customer_order as co group by day(co.added_time),yearweek(co.added_time);


}
