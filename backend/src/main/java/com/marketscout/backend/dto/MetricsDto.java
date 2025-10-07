package com.marketscout.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetricsDto {
    private String symbol;
    private Double marketCap;
    private Double pe;              // P/E ratio
    private Double pb;              // P/B ratio
    private Double dividendYield;
    private Double beta;
    private Double revenueGrowth;
    private Double grossMargin;
    private String sector;
    private String industry;
}
