package com.marketscout.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.marketscout.backend.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MarketDataService {
    
    private final FinnhubService finnhubService;
    private final ChartService chartService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Get normalized quote data (Finnhub primary, Twelve Data fallback)
     */
    @Cacheable(value = "quotes", key = "#symbol")
    public QuoteDto getQuote(String symbol) {
        try {
            String response = finnhubService.getQuote(symbol);
            JsonNode json = objectMapper.readTree(response);
            
            // Finnhub quote response: {"c": current, "d": change, "dp": changePct, "h": high, "l": low, "o": open, "pc": prevClose, "t": timestamp}
            return QuoteDto.builder()
                    .symbol(symbol.toUpperCase())
                    .price(json.has("c") ? json.get("c").asDouble() : null)
                    .change(json.has("d") ? json.get("d").asDouble() : null)
                    .changePct(json.has("dp") ? json.get("dp").asDouble() : null)
                    .open(json.has("o") ? json.get("o").asDouble() : null)
                    .high(json.has("h") ? json.get("h").asDouble() : null)
                    .low(json.has("l") ? json.get("l").asDouble() : null)
                    .prevClose(json.has("pc") ? json.get("pc").asDouble() : null)
                    .timestamp(json.has("t") ? json.get("t").asLong() : null)
                    .build();
        } catch (Exception e) {
            log.error("Error fetching quote for {}: {}", symbol, e.getMessage());
            return QuoteDto.builder().symbol(symbol.toUpperCase()).build();
        }
    }
    
    /**
     * Get candle data from Twelve Data
     */
    @Cacheable(value = "candles", key = "#symbol + '-' + #interval + '-' + #from + '-' + #to")
    public CandleSeriesDto getCandles(String symbol, String interval, String from, String to) {
        try {
            String response = chartService.getTimeSeries(symbol, interval, from, to);
            JsonNode json = objectMapper.readTree(response);
            
            List<CandleDto> candles = new ArrayList<>();
            
            // Twelve Data response: {"values": [{"datetime": "...", "open": "...", "high": "...", "low": "...", "close": "...", "volume": "..."}]}
            if (json.has("values") && json.get("values").isArray()) {
                for (JsonNode value : json.get("values")) {
                    CandleDto candle = CandleDto.builder()
                            .t(parseTimestamp(value.get("datetime").asText()))
                            .o(value.has("open") ? Double.parseDouble(value.get("open").asText()) : null)
                            .h(value.has("high") ? Double.parseDouble(value.get("high").asText()) : null)
                            .l(value.has("low") ? Double.parseDouble(value.get("low").asText()) : null)
                            .c(value.has("close") ? Double.parseDouble(value.get("close").asText()) : null)
                            .v(value.has("volume") ? Long.parseLong(value.get("volume").asText()) : null)
                            .build();
                    candles.add(candle);
                }
            }
            
            return CandleSeriesDto.builder()
                    .symbol(symbol.toUpperCase())
                    .interval(interval)
                    .from(from)
                    .to(to)
                    .candles(candles)
                    .build();
        } catch (Exception e) {
            log.error("Error fetching candles for {}: {}", symbol, e.getMessage());
            return CandleSeriesDto.builder()
                    .symbol(symbol.toUpperCase())
                    .interval(interval)
                    .from(from)
                    .to(to)
                    .candles(new ArrayList<>())
                    .build();
        }
    }
    
    /**
     * Get company news from Finnhub
     */
    @Cacheable(value = "news", key = "#symbol + '-' + #from + '-' + #to")
    public List<NewsItemDto> getNews(String symbol, String from, String to) {
        try {
            String response = finnhubService.getCompanyNews(symbol, from, to);
            JsonNode json = objectMapper.readTree(response);
            
            List<NewsItemDto> news = new ArrayList<>();
            
            // Finnhub news response: [{"headline": "...", "source": "...", "url": "...", "summary": "...", "datetime": timestamp}]
            if (json.isArray()) {
                for (JsonNode item : json) {
                    NewsItemDto newsItem = NewsItemDto.builder()
                            .headline(item.has("headline") ? item.get("headline").asText() : null)
                            .source(item.has("source") ? item.get("source").asText() : null)
                            .url(item.has("url") ? item.get("url").asText() : null)
                            .summary(item.has("summary") ? item.get("summary").asText() : null)
                            .publishedAt(item.has("datetime") ? item.get("datetime").asLong() : null)
                            .build();
                    news.add(newsItem);
                }
            }
            
            return news;
        } catch (Exception e) {
            log.error("Error fetching news for {}: {}", symbol, e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Search symbols from Finnhub
     */
    @Cacheable(value = "search", key = "#query")
    public List<SearchResultDto> search(String query) {
        try {
            String response = finnhubService.searchSymbols(query);
            JsonNode json = objectMapper.readTree(response);
            
            List<SearchResultDto> results = new ArrayList<>();
            
            // Finnhub search response: {"result": [{"description": "...", "displaySymbol": "...", "symbol": "...", "type": "..."}]}
            if (json.has("result") && json.get("result").isArray()) {
                for (JsonNode item : json.get("result")) {
                    SearchResultDto result = SearchResultDto.builder()
                            .symbol(item.has("symbol") ? item.get("symbol").asText() : null)
                            .name(item.has("description") ? item.get("description").asText() : null)
                            .exchange(item.has("type") ? item.get("type").asText() : null)
                            .currency(null) // Finnhub doesn't provide currency in search
                            .build();
                    results.add(result);
                }
            }
            
            return results;
        } catch (Exception e) {
            log.error("Error searching for {}: {}", query, e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Get key metrics from Finnhub
     */
    @Cacheable(value = "metrics", key = "#symbol")
    public MetricsDto getMetrics(String symbol) {
        try {
            // Get metrics from Finnhub
            String metricsResponse = finnhubService.getKeyMetrics(symbol);
            JsonNode metricsJson = objectMapper.readTree(metricsResponse);
            
            // Get company profile for sector/industry
            String profileResponse = finnhubService.getCompanyProfile(symbol);
            JsonNode profileJson = objectMapper.readTree(profileResponse);
            
            // Finnhub metrics response: {"metric": {"marketCapitalization": ..., "peBasicExclExtraTTM": ..., ...}, "series": {...}}
            JsonNode metric = metricsJson.has("metric") ? metricsJson.get("metric") : objectMapper.createObjectNode();
            
            return MetricsDto.builder()
                    .symbol(symbol.toUpperCase())
                    .marketCap(metric.has("marketCapitalization") ? metric.get("marketCapitalization").asDouble() : null)
                    .pe(metric.has("peBasicExclExtraTTM") ? metric.get("peBasicExclExtraTTM").asDouble() : null)
                    .pb(metric.has("pbAnnual") ? metric.get("pbAnnual").asDouble() : null)
                    .dividendYield(metric.has("dividendYieldIndicatedAnnual") ? metric.get("dividendYieldIndicatedAnnual").asDouble() : null)
                    .beta(metric.has("beta") ? metric.get("beta").asDouble() : null)
                    .revenueGrowth(metric.has("revenueGrowthTTMYoy") ? metric.get("revenueGrowthTTMYoy").asDouble() : null)
                    .grossMargin(metric.has("grossMarginTTM") ? metric.get("grossMarginTTM").asDouble() : null)
                    .sector(profileJson.has("finnhubIndustry") ? profileJson.get("finnhubIndustry").asText() : null)
                    .industry(profileJson.has("finnhubIndustry") ? profileJson.get("finnhubIndustry").asText() : null)
                    .build();
        } catch (Exception e) {
            log.error("Error fetching metrics for {}: {}", symbol, e.getMessage());
            return MetricsDto.builder().symbol(symbol.toUpperCase()).build();
        }
    }
    
    /**
     * Helper to parse datetime string to Unix timestamp
     */
    private Long parseTimestamp(String datetime) {
        try {
            // Try parsing as date-only format (yyyy-MM-dd)
            if (datetime.length() == 10) {
                java.time.LocalDate date = java.time.LocalDate.parse(datetime);
                return date.atStartOfDay(java.time.ZoneId.of("America/New_York")).toEpochSecond();
            }
            // Try parsing as ISO datetime
            return java.time.Instant.parse(datetime).getEpochSecond();
        } catch (Exception e) {
            log.warn("Failed to parse timestamp: {}", datetime);
            return null;
        }
    }
}
