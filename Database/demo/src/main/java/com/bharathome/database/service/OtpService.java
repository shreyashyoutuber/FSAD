package com.bharathome.database.service;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OtpService {

    private record OtpEntry(String otp, LocalDateTime expiry) {
    }

    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    public String generateAndStoreOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(email.toLowerCase(), new OtpEntry(otp, LocalDateTime.now().plusMinutes(5)));
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        OtpEntry entry = otpStore.get(email.toLowerCase());
        if (entry == null)
            return false;
        if (LocalDateTime.now().isAfter(entry.expiry())) {
            otpStore.remove(email.toLowerCase());
            return false;
        }
        if (!entry.otp().equals(otp))
            return false;
        otpStore.remove(email.toLowerCase()); // OTP used, remove it
        return true;
    }
}
