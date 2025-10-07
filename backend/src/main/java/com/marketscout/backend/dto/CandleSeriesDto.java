package com.marketscout.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandleSeriesDto {
    private String symbol;
    private String interval;
    private String from;
    private String to;
    private List<CandleDto> candles;
}
