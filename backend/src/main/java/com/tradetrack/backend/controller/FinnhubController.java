package com.tradetrack.backend.controller;

import com.tradetrack.backend.service.FinnhubService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finnhub")
public class FinnhubController {
    private final FinnhubService service;
    public FinnhubController(FinnhubService service) {
        this.service = service;
    }

    @GetMapping("/quote/{symbol}")
    public ResponseEntity<String> quote(@PathVariable String symbol) {
        return ResponseEntity.ok(service.getQuote(symbol));
    }
}

