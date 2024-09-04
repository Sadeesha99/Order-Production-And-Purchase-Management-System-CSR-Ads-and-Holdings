package com.csr.reports;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfitLossReport {
    private String date;
    private String income;
    private String expense;
    private String profit;
}
