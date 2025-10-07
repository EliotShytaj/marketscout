package com.marketscout.backend.controller;

import com.marketscout.backend.dto.*;
import com.marketscout.backend.service.MarketDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
public class MarketController {
    
    private final MarketDataService marketDataService;
    
    /**
     * GET /api/market/quote?symbol=AAPL
     */
    @GetMapping("/quote")
    public ResponseEntity<QuoteDto> getQuote(@RequestParam String symbol) {
        if (symbol == null || symbol.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(marketDataService.getQuote(symbol));
    }
    
    /**
     * GET /api/market/candles?symbol=AAPL&interval=1day&from=2025-06-01&to=2025-07-30
     */
    @GetMapping("/candles")
    public ResponseEntity<CandleSeriesDto> getCandles(
            @RequestParam String symbol,
            @RequestParam String interval,
            @RequestParam String from,
            @RequestParam String to) {
        
        if (symbol == null || symbol.isBlank() || 
            interval == null || interval.isBlank() || 
            from == null || from.isBlank() || 
            to == null || to.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.ok(marketDataService.getCandles(symbol, interval, from, to));
    }
    
    /**
     * GET /api/market/news?symbol=AAPL&from=2025-09-01&to=2025-10-07
     */
    @GetMapping("/news")
    public ResponseEntity<List<NewsItemDto>> getNews(
            @RequestParam String symbol,
            @RequestParam String from,
            @RequestParam String to) {
        
        if (symbol == null || symbol.isBlank() || 
            from == null || from.isBlank() || 
            to == null || to.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.ok(marketDataService.getNews(symbol, from, to));
    }
    
    /**
     * GET /api/market/search?q=apple
     */
    @GetMapping("/search")
    public ResponseEntity<List<SearchResultDto>> search(@RequestParam String q) {
        if (q == null || q.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(marketDataService.search(q));
    }
    
    /**
     * GET /api/market/metrics?symbol=AAPL
     */
    @GetMapping("/metrics")
    public ResponseEntity<MetricsDto> getMetrics(@RequestParam String symbol) {
        if (symbol == null || symbol.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(marketDataService.getMetrics(symbol));
    }
}
