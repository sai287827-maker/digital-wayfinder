package com.example.DigitalWayfinder.service;

import com.azure.core.credential.TokenRequestContext;
import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.DigitalWayfinder.dto.EmbedConfigDTO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PowerBIService {

    @Value("${powerbi.client-id}")
    private String clientId;

    @Value("${powerbi.client-secret}")
    private String clientSecret;

    @Value("${powerbi.tenant-id}")
    private String tenantId;

    @Value("${powerbi.workspace-id}")
    private String workspaceId;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public EmbedConfigDTO getEmbedConfig(String reportId) throws Exception {

        // ✅ 1. Generate Azure AD Token
        ClientSecretCredential credential = new ClientSecretCredentialBuilder()
                .clientId(clientId)
                .clientSecret(clientSecret)
                .tenantId(tenantId)
                .build();

        String accessToken = credential
                .getToken(new TokenRequestContext()
                        .addScopes("https://analysis.windows.net/powerbi/api/.default"))
                .block()
                .getToken();

        // ✅ 2. Get Report Details (embedUrl)
        String reportUrl = "https://api.powerbi.com/v1.0/myorg/groups/"
                + workspaceId + "/reports/" + reportId;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        ResponseEntity<String> reportResponse = restTemplate.exchange(
                reportUrl,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                String.class);

        JsonNode reportJson = objectMapper.readTree(reportResponse.getBody());
        String embedUrl = reportJson.get("embedUrl").asText();

        // ✅ 3. Generate Embed Token (IMPORTANT)
        String tokenUrl = reportUrl + "/GenerateToken";

        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.setBearerAuth(accessToken);
        tokenHeaders.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = "{ \"accessLevel\": \"view\" }";

        ResponseEntity<String> tokenResponse = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                new HttpEntity<>(requestBody, tokenHeaders),
                String.class);

        JsonNode tokenJson = objectMapper.readTree(tokenResponse.getBody());
        String embedToken = tokenJson.get("token").asText();

        // ✅ 4. Return DTO
        return new EmbedConfigDTO(embedUrl, embedToken, reportId);
    }
}