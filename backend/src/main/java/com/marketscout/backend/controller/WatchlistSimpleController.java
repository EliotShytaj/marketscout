package com.marketscout.backend.controller;

import com.marketscout.backend.entity.WatchlistEntry;
import com.marketscout.backend.service.WatchlistSimpleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchlistSimpleController {
    
    private final WatchlistSimpleService service;
    
    /**
     * GET /api/watchlist/lists?email=user@example.com
     * Returns: ["Tech", "Energy", ...]
     */
    @GetMapping("/lists")
    public ResponseEntity<List<String>> getListNames(@RequestParam String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(service.getListNames(email));
    }
    
    /**
     * GET /api/watchlist/items?email=user@example.com&list=Tech
     * Returns: [WatchlistEntry, ...]
     */
    @GetMapping("/items")
    public ResponseEntity<List<WatchlistEntry>> getListItems(
            @RequestParam String email,
            @RequestParam String list) {
        
        if (email == null || email.isBlank() || list == null || list.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.ok(service.getList(email, list));
    }
    
    /**
     * GET /api/watchlist/all?email=user@example.com
     * Returns: [WatchlistEntry, ...]
     */
    @GetMapping("/all")
    public ResponseEntity<List<WatchlistEntry>> getAllItems(@RequestParam String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(service.getAll(email));
    }
    
    /**
     * POST /api/watchlist/add
     * Body: { "email": "user@example.com", "list": "Tech", "symbol": "AAPL" }
     */
    @PostMapping("/add")
    public ResponseEntity<?> addSymbol(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String list = body.get("list");
        String symbol = body.get("symbol");
        
        if (email == null || email.isBlank() || 
            list == null || list.isBlank() || 
            symbol == null || symbol.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
        }
        
        Optional<WatchlistEntry> entry = service.add(email, list, symbol);
        
        if (entry.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Symbol already exists in this list"));
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(entry.get());
    }
    
    /**
     * DELETE /api/watchlist/remove?email=user@example.com&list=Tech&symbol=AAPL
     */
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeSymbol(
            @RequestParam String email,
            @RequestParam String list,
            @RequestParam String symbol) {
        
        if (email == null || email.isBlank() || 
            list == null || list.isBlank() || 
            symbol == null || symbol.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required parameters"));
        }
        
        boolean removed = service.remove(email, list, symbol);
        
        if (!removed) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Entry not found"));
        }
        
        return ResponseEntity.ok(Map.of("success", true));
    }
}
