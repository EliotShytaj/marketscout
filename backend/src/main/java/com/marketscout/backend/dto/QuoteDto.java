package com.marketscout.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuoteDto {
    private String symbol;
    private Double price;           // current price
    private Double change;          // price change
    private Double changePct;       // percent change
    private Double open;
    private Double high;
    private Double low;
    private Double prevClose;
    private Long timestamp;         // Unix timestamp
}
