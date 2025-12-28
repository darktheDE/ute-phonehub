# ⚡ Gemini Fallback - Quick Reference

## 🔑 10 API Keys Setup - 2-Minute Guide

### 1. Get Keys
```bash
# Visit https://ai.google.dev/
# Create 10 Google accounts OR 10 Google Cloud projects
# Generate 10 API keys
```

### 2. Update .env
```bash
cd backend
nano .env  # or edit in VS Code

# Add 10 keys:
GEMINI_API_KEY_1=AIzaSy...
GEMINI_API_KEY_2=AIzaSy...
... (up to KEY_10)
```

### 3. Verify & Deploy
```bash
cd backend
docker-compose down
docker-compose up -d --build

# Check logs
docker logs utephonehub-backend | grep "fallback"
```

---

## 📊 Capacity Table

| Keys | RPM | Burst | Cost |
|------|-----|-------|------|
| 1 | 15 | Limited | Free ❌ |
| 3 | 45 | Low | Free ⚠️ |
| 10 | 150 | Good | Free ✅ |
| 10 + 5 paid | 500+ | High | $$ 🚀 |

---

## 🔍 Logs to Monitor

```bash
# Real-time monitoring
docker logs -f utephonehub-backend | grep "API key"

# Expected output:
# ✅ "Fallback keys available: 10"
# ✅ "Thử API key #1" → "Thành công" 
# ⚠️  "Thử API key #3" → "Fail" → "Thử API key #4"
```

---

## 🐛 Quick Troubleshooting

| Error | Fix |
|-------|-----|
| No keys found | Check .env has GEMINI_API_KEY_1 |
| All keys failed | Check keys are valid, network OK |
| Slow (3+ sec) | Normal retry time, expected |
| Not using fallback | Enable: GEMINI_FALLBACK_ENABLED=true |

---

## 💡 Code Usage

```java
// It's automatic! Services use fallback internally:

@Autowired
private GeminiFallbackService fallbackService;

// Just call - fallback handles key rotation
String response = fallbackService.executeWithFallback(
    requestJson, 
    false  // false = text, true = embedding
);

// ✨ Automatically retries with next key on failure
```

---

## 🎯 Deploy Checklist

- [ ] 10 API keys generated
- [ ] GEMINI_API_KEY_1 through KEY_10 in .env
- [ ] docker-compose build successful
- [ ] Logs show "X fallback keys available"
- [ ] Test curl returns data
- [ ] Monitor logs for fallback usage

---

**Time to implement:** ~15 minutes  
**Reliability boost:** 6.7x (single key to 10 keys)  
**Cost:** $0 (using free tier)
