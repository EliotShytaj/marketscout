// src/main/java/com/tradetrack/backend/controller/FinnhubController.java
package com.marketscout.backend.controller;

import com.marketscout.backend.service.FinnhubService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finnhub")
public class FinnhubController {

    private final FinnhubService svc;

    public FinnhubController(FinnhubService svc) {
        this.svc = svc;
    }

    @GetMapping("/quote/{symbol}")
    public ResponseEntity<String> quote(@PathVariable String symbol) {
        return ResponseEntity.ok(svc.getQuote(symbol));
    }

    @GetMapping("/profile/{symbol}")
    public ResponseEntity<String> profile(@PathVariable String symbol) {
        return ResponseEntity.ok(svc.getCompanyProfile(symbol));
    }

    @GetMapping("/news/{symbol}")
    public ResponseEntity<String> news(
            @PathVariable String symbol,
            @RequestParam String from,
            @RequestParam String to
    ) {
        return ResponseEntity.ok(svc.getCompanyNews(symbol, from, to));
    }

    @GetMapping("/earnings")
    public ResponseEntity<String> earnings(
            @RequestParam String from,
            @RequestParam String to
    ) {
        return ResponseEntity.ok(svc.getEarningsCalendar(from, to));
    }

    @GetMapping("/search")
    public ResponseEntity<String> search(@RequestParam String q) {
        return ResponseEntity.ok(svc.searchSymbols(q));
    }

    @GetMapping("/recommendation/{symbol}")
    public ResponseEntity<String> recommendation(@PathVariable String symbol) {
        return ResponseEntity.ok(svc.getRecommendations(symbol));
    }

    @GetMapping("/insider/{symbol}")
    public ResponseEntity<String> insider(@PathVariable String symbol) {
        return ResponseEntity.ok(svc.getInsiderTransactions(symbol));
    }

    @GetMapping("/peers/{symbol}")
    public ResponseEntity<String> peers(@PathVariable String symbol) {
        return ResponseEntity.ok(svc.getPeers(symbol));
    }

    @GetMapping("/metrics/{symbol}")
    public ResponseEntity<String> metrics(@PathVariable String symbol) {
        return ResponseEntity.ok(svc.getKeyMetrics(symbol));
    }

}

