// src/main/java/com/tradetrack/backend/service/FinnhubService.java
package com.tradetrack.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FinnhubService {
    private final RestTemplate rest;
    private final String apiKey;

    public FinnhubService(RestTemplate rest,
                          @Value("${finnhub.api.key}") String apiKey) {
        this.rest   = rest;
        this.apiKey = apiKey;
    }

    public String getQuote(String symbol) {
        return rest.getForObject(
                "https://finnhub.io/api/v1/quote?symbol={s}&token={k}",
                String.class, symbol, apiKey);
    }

    public String getCompanyProfile(String symbol) {
        return rest.getForObject(
                "https://finnhub.io/api/v1/stock/profile2?symbol={s}&token={k}",
                String.class, symbol, apiKey);
    }

    public String getCompanyNews(String symbol, String from, String to) {
        return rest.getForObject(
                "https://finnhub.io/api/v1/company-news?symbol={s}&from={f}&to={t}&token={k}",
                String.class, symbol, from, to, apiKey);
    }

    public String getEarningsCalendar(String from, String to) {
        return rest.getForObject(
                "https://finnhub.io/api/v1/calendar/earnings?from={f}&to={t}&token={k}",
                String.class, from, to, apiKey);
    }

    public String searchSymbols(String query) {
        return rest.getForObject(
                "https://finnhub.io/api/v1/search?q={q}&token={k}",
                String.class, query, apiKey);
    }

    public String getRecommendations(String symbol) {
        return rest.getForObject(
                "https://finnhub.io/api/v1/stock/recommendation?symbol={s}&token={k}",
                String.class, symbol, apiKey);
    }

    public String getInsiderTransactions(String symbol) {
        return rest.getForObject(
                "https://finnhub.io/api/v1/stock/insider-transactions?symbol={s}&token={k}",
                String.class, symbol, apiKey);
    }

    public String getPeers(String symbol) {
        return rest.getForObject(
                "https://finnhub.io/api/v1/stock/peers?symbol={s}&token={k}",
                String.class, symbol, apiKey);
    }

    public String getKeyMetrics(String symbol) {
        return rest.getForObject(
                "https://finnhub.io/api/v1/stock/metric?symbol={s}&metric=all&token={k}",
                String.class, symbol, apiKey);
    }
}

