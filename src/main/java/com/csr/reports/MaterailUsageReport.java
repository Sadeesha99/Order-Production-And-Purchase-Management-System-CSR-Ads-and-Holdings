package com.csr.reports;

import com.csr.material.Material;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaterailUsageReport {

    private String material_id;
    private String date;

    private String materialusage;
}
