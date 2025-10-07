package com.marketscout.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandleDto {
    private Long t;      // timestamp
    private Double o;    // open
    private Double h;    // high
    private Double l;    // low
    private Double c;    // close
    private Long v;      // volume
}
