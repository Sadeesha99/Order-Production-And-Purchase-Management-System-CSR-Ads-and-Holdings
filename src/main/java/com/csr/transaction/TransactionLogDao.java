package com.csr.transaction;

import com.csr.reports.ProfitLossReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface TransactionLogDao extends JpaRepository<TransactionLog,Integer> {

//    SELECT monthname(tl.logged_time) AS date, SUM(CASE WHEN tl.income_type = 1 THEN tl.transaction_amount ELSE 0 END) AS income,
//    SUM(CASE WHEN tl.income_type = 0 THEN tl.transaction_amount ELSE 0 END) AS expense, SUM(CASE WHEN tl.income_type = 1
//    THEN tl.transaction_amount ELSE 0 END) - SUM(CASE WHEN tl.income_type = 0 THEN tl.transaction_amount ELSE 0 END) AS profit FROM
//    csroveraller.transaction_log AS tl  where tl.logged_time between ?1 and ?2 GROUP BY  monthname(tl.logged_time)

//    SELECT
//    CONCAT(YEAR(tl.logged_time), '-', MONTHNAME(tl.logged_time)) AS month_year,
//    SUM(CASE WHEN tl.income_type = 1 THEN tl.transaction_amount ELSE 0 END) AS income,
//    SUM(CASE WHEN tl.income_type = 0 THEN tl.transaction_amount ELSE 0 END) AS expense,
//    SUM(CASE WHEN tl.income_type = 1 THEN tl.transaction_amount ELSE 0 END) -
//    SUM(CASE WHEN tl.income_type = 0 THEN tl.transaction_amount ELSE 0 END) AS profit
//    FROM  csroveraller.transaction_log AS tl  where tl.logged_time between '2023-07-17' and '2024-08-29'
//    GROUP BY YEAR(tl.logged_time), MONTH(tl.logged_time)
//    ORDER BY YEAR(tl.logged_time), MONTH(tl.logged_time);


    @Query(value = "SELECT \n" +
            "    CONCAT(YEAR(tl.logged_time), '-', MONTHNAME(tl.logged_time)) AS date, \n" +
            "    SUM(CASE WHEN tl.income_type = 1 THEN tl.transaction_amount ELSE 0 END) AS income,  \n" +
            "    SUM(CASE WHEN tl.income_type = 0 THEN tl.transaction_amount ELSE 0 END) AS expense,\n" +
            "    SUM(CASE WHEN tl.income_type = 1 THEN tl.transaction_amount ELSE 0 END) - \n" +
            "     SUM(CASE WHEN tl.income_type = 0 THEN tl.transaction_amount ELSE 0 END) AS profit\n" +
            "FROM  csroveraller.transaction_log AS tl  where tl.logged_time between ?1 and ?2 \n" +
            "GROUP BY YEAR(tl.logged_time), MONTH(tl.logged_time)\n" +
            "ORDER BY YEAR(tl.logged_time), MONTH(tl.logged_time);", nativeQuery=true)
    public String[][] getProfitLossReportBetweenTwoDaysGroupByMonth(String startDate , String endDate);

    @Query(value = "SELECT \n" +
            "    date(tl.logged_time) AS date, \n" +
            "    SUM(CASE WHEN tl.income_type = 1 THEN tl.transaction_amount ELSE 0 END) AS income,  \n" +
            "    SUM(CASE WHEN tl.income_type = 0 THEN tl.transaction_amount ELSE 0 END) AS expense,\n" +
            "    SUM(CASE WHEN tl.income_type = 1 THEN tl.transaction_amount ELSE 0 END) - \n" +
            "     SUM(CASE WHEN tl.income_type = 0 THEN tl.transaction_amount ELSE 0 END) AS profit\n" +
            "FROM  csroveraller.transaction_log AS tl  where tl.logged_time between ?1 and ?2 \n" +
            "GROUP BY  date(tl.logged_time);", nativeQuery=true)
    public String[][] getProfitLossReportBetweenTwoDaysGroupByDate(String startDate , String endDate);

}
