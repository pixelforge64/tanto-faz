const express = require("express");
const admin = require("firebase-admin");

const app = express();

app.use(express.raw({ type: "application/json" }));

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "gen-lang-client-0008148883",
    clientEmail: "firebase-adminsdk-fbsvc@gen-lang-client-0008148883.iam.gserviceaccount.com",
    privateKey: `-----BEGIN PRIVATE KEY-----
\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCehb0Uc1kVnqQj\nsuqT37IwBQX2g7kcv23iJr3TgjnUdJmsprpslY5N0XsGXU6t+iBfojawehaY32s7\nd3da51AYM/EFZBPni1P2PzKh07I3+npQ05u0arYSGZ41W8hBpZiv7ybx9dL+lvx5\n0fp0ZxGCVq4MA2YzSUAH0h16kHwToSuutg1z7SZlN1vSz819XHB/YaA17tYumD/Q\nZX1taCBwo1qTD//nzwYjzemt0EKWMesHrdN0lTi9fvRN0PgVWJVewulPBOgF/Kxb\nf4a8KLLX/DZNWu+HfvwPTxv+R6Ckbn92TDQjWwAtw5EIbLAlKsRwLnz8/zCAATt1\nzlHLEqy1AgMBAAECggEABXfLqhssITqyjY2uxDuE2Aha/eIUyPOnHL7P25jEGbqM\n5h+ZJ2+FiVR2t8/mS8ooguFOSB+Uoct2atvH05b41GDkSSvmzjI9iu1VTS+HbUwN\nReD1X7oyPg/BUooFhL2Aywlxhd/qxNUx78TJAhS1Df0jQ0RRv+agrV8Mx8Jt7o0E\nf5kKk7R/E/c21tdMcAXDSWmyOsfKaTTWRDh4d8WBQGjtjYknjK2sQ4lIetAuiztk\nl5GIYYsiiNX+KPCLWjjxRs4G7MdxhLM7WPRArZnONdZiz3fjGa1Du0PZzdyqI8bR\nOCydkQwx7b+ZzytB/9pcLtUpM71Vr/7/WuOWZmCPwQKBgQDO7cqqlIgt1nw20ms5\nCPtarNuc0yPrT+FnLq+nJDzt72GEELQ14niLqeD77dCAqRTLeyep0nEdT+tqATEN\nW1rMxIZPESXwKDoQGWH32Occ4o6UDw/aovwzO+caruS9rYVcNfK05v2+5wlh1nl6\njsDG+wO9v/oUXFI8aKBpDI8BwQKBgQDEHUtvn1/S76eVrJXZBDcv8XXP/oCbZCBs\nCr8hT8Syyv9F3JAnxNt2iUPQb9m0WLj/KknnMAaivYihpRfZH9wTDVDlAWJ6aYOa\nW/Y1meJ4ypUXpdfPJ5rjQ+MYPxeKZ28ba2bEP+lLb96iIJGZ7dYWgDKfgNSrC6oC\n8Wctr6e/9QKBgCi7Hb1d50A+i8yutnRPlEpQ5BmGZfeXjaKlyeV4eJXNHMDGGPLS\nVTAIjESKlxP8NB+pajE/PwyqAoinG2SpqsHLnTRLB9Cx2lv44xPKGhPRdIcoP9Kl\nakcbb24NJvE/CpUP+WoqXaAKEgq0EM1S9Bc2qZHcC/meAoHphkmnMy8BAoGABKZ1\nLXZn/UZ1gNUQ0I6LCHX/RylPv1+GbUlr8sxDa8Hof62VNXwzgAINO5oLXX1lFZfZ\nHMRExAMehEa35AwfWcxNCMEZprFtz3Eyy16Uwix7kI38KgtUXuMzNVX5puyA8/N+\nAlVJoOJMMyf2i+HZ27q6eJHDeTLTmzJCMhEiNykCgYEAya+B8/M6WY0OUD2rKoHr\nTqiiORb7jvqAix/nowm8E2DffobCtzLTL8KsANVl1zdnZtNecUER7B8hMm1FmWaX\nlg8lpX/J0WjJRklh4uV7Ut5QygYRFNlCRdqjInGrMouu/vYyJ6NK/DF6zLDeavZ2\nyYa5W6JvhSqG2sM3Kk6GLOk=\n-----END PRIVATE KEY-----\n
-----END PRIVATE KEY-----`,
  }),
});

const db = admin.firestore();

app.post("/webhook", async (req, res) => {
  res.sendStatus(200); // 🔥 responde rápido

  try {
    const event = JSON.parse(req.body.toString());

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const email = session.customer_details?.email;
      const amount = session.amount_total;

      console.log("Recebido:", email, amount);
    }
  } catch (err) {
    console.error("ERRO:", err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando"));
