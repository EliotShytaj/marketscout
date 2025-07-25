// src/main/java/com/tradetrack/backend/controller/FinnhubController.java
package com.tradetrack.backend.controller;

import com.tradetrack.backend.service.FinnhubService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finnhub")
public class FinnhubController {

    private final FinnhubService finnhubService;

    public FinnhubController(FinnhubService finnhubService) {
        this.finnhubService = finnhubService;
    }

    //latest quote for the ticker
    @GetMapping("/quote/{symbol}")
    public ResponseEntity<String> getQuote(@PathVariable String symbol) {
        String json = finnhubService.getQuote(symbol);
        return ResponseEntity.ok(json);
    }

    //company profile
    @GetMapping("/profile/{symbol}")
    public ResponseEntity<String> getProfile(@PathVariable String symbol) {
        String json = finnhubService.getCompanyProfile(symbol);
        return ResponseEntity.ok(json);
    }
}


