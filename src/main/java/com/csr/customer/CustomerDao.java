package com.csr.customer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface CustomerDao extends JpaRepository<Customer,Integer> {

    //Get all customers by Ascending order to the customer_status, to display deleted items last
    @Query("SELECT c FROM Customer c ORDER BY c.customer_status_id.id asc")
    public List<Customer> getAllCustomersASC();
    @Query("SELECT c FROM Customer c where (c.customer_status_id.id=1) ORDER BY c.id desc")
    public List<Customer> getAllActiveCustomersByDESC();
    @Query("SELECT c FROM Customer c where (c.customer_status_id.id=2) ORDER BY c.id desc")
    public List<Customer> getAllInActiveCustomersByDESC();
    @Query("SELECT c FROM Customer c where (c.customer_status_id.id=3) ORDER BY c.id desc")
    public List<Customer> getAllDeletedCustomersByDESC();

    @Query(value = "select concat('C',lpad(substring(max(c.custno),6)+1,6,'0')) as custno from csroveraller.customer as c;", nativeQuery = true)
    public String getNextCustomerNo();

    //Customer by mobile
    @Query(value = "Select c from Customer c where c.mobile=?1")
    public Customer getByMobile(String mobile);

    //SELECT c.* FROM csroveraller.customer as c where c.id in (SELECT co.id FROM csroveraller.customer_order as co where co.customer_order_status_id<>4 and co.customer_order_status_id<>5 and co.remaining_balance<>0);
    @Query(value = "SELECT C FROM Customer as C where C.id in (SELECT CO.customer_id.id FROM CustomerOrder as CO where CO.customer_order_status_id.id<>4 and CO.customer_order_status_id.id<>5 and CO.remaining_balance<>0)")
    public List<Customer> customersWithNotCompletedOrder();
}
