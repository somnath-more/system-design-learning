package com.library.config;

import com.library.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Component
public class JwtUtil {
    // Base64 encoded secret key (must be at least 256 bits for HS256)
    @Value("${jwt.secret}")
    private String secretKey; // Injected from application.properties
    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME ; // 1 hour production, use a secure key and store it safely
   private SecretKey getSigningKey() {
       // Decode the Base64 encoded secret key
       return Keys.hmacShaKeyFor(java.util.Base64.getDecoder().decode(secretKey));
   }
   public String generateToken(User user) {
        // Implement JWT token generation logic here

        return Jwts.builder().setSubject(user.getUsername())
                .claim("role", user.getRole())
                .setExpiration(new java.util.Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
         Claims claims=Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
        return claims.getSubject();
    }
}
