package com.tradetrack.backend.controller;

import com.tradetrack.backend.service.ChartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/twelvedata")
public class ChartController {

    private final ChartService chartService;

    public ChartController(ChartService chartService) {
        this.chartService = chartService;
    }
    @GetMapping("/candles/{symbol}")
    public ResponseEntity<String> getCandles(
            @PathVariable String symbol,
            @RequestParam String interval,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        String json = chartService.getTimeSeries(symbol, interval, startDate, endDate);
        return ResponseEntity.ok(json);
    }
}
