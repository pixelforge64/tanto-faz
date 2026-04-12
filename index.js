import express from "express";
import admin from "firebase-admin";

const app = express();

// ⚠️ IMPORTANTE: Stripe precisa do body RAW
app.use(express.raw({ type: "application/json" }));

// CONFIG FIREBASE
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "gen-lang-client-0008148883",
    clientEmail: "firebase-adminsdk-fbsvc@gen-lang-client-0008148883.iam.gserviceaccount.com",
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCehb0Uc1kVnqQj
suqT37IwBQX2g7kcv23iJr3TgjnUdJmsprpslY5N0XsGXU6t+iBfojawehaY32s7
d3da51AYM/EFZBPni1P2PzKh07I3+npQ05u0arYSGZ41W8hBpZiv7ybx9dL+lvx5
0fp0ZxGCVq4MA2YzSUAH0h16kHwToSuutg1z7SZlN1vSz819XHB/YaA17tYumD/Q
ZX1taCBwo1qTD//nzwYjzemt0EKWMesHrdN0lTi9fvRN0PgVWJVewulPBOgF/Kxb
f4a8KLLX/DZNWu+HfvwPTxv+R6Ckbn92TDQjWwAtw5EIbLAlKsRwLnz8/zCAATt1
zlHLEqy1AgMBAAECggEABXfLqhssITqyjY2uxDuE2Aha/eIUyPOnHL7P25jEGbqM
5h+ZJ2+FiVR2t8/mS8ooguFOSB+Uoct2atvH05b41GDkSSvmzjI9iu1VTS+HbUwN
ReD1X7oyPg/BUooFhL2Aywlxhd/qxNUx78TJAhS1Df0jQ0RRv+agrV8Mx8Jt7o0E
f5kKk7R/E/c21tdMcAXDSWmyOsfKaTTWRDh4d8WBQGjtjYknjK2sQ4lIetAuiztk
l5GIYYsiiNX+KPCLWjjxRs4G7MdxhLM7WPRArZnONdZiz3fjGa1Du0PZzdyqI8bR
OCydkQwx7b+ZzytB/9pcLtUpM71Vr/7/WuOWZmCPwQKBgQDO7cqqlIgt1nw20ms5
CPtarNuc0yPrT+FnLq+nJDzt72GEELQ14niLqeD77dCAqRTLeyep0nEdT+tqATEN
W1rMxIZPESXwKDoQGWH32Occ4o6UDw/aovwzO+caruS9rYVcNfK05v2+5wlh1nl6
jsDG+wO9v/oUXFI8aKBpDI8BwQKBgQDEHUtvn1/S76eVrJXZBDcv8XXP/oCbZCBs
Cr8hT8Syyv9F3JAnxNt2iUPQb9m0WLj/KknnMAaivYihpRfZH9wTDVDlAWJ6aYOa
W/Y1meJ4ypUXpdfPJ5rjQ+MYPxeKZ28ba2bEP+lLb96iIJGZ7dYWgDKfgNSrC6oC
8Wctr6e/9QKBgCi7Hb1d50A+i8yutnRPlEpQ5BmGZfeXjaKlyeV4eJXNHMDGGPLS
VTAIjESKlxP8NB+pajE/PwyqAoinG2SpqsHLnTRLB9Cx2lv44xPKGhPRdIcoP9Kl
akcbb24NJvE/CpUP+WoqXaAKEgq0EM1S9Bc2qZHcC/meAoHphkmnMy8BAoGABKZ1
LXZn/UZ1gNUQ0I6LCHX/RylPv1+GbUlr8sxDa8Hof62VNXwzgAINO5oLXX1lFZfZ
HMRExAMehEa35AwfWcxNCMEZprFtz3Eyy16Uwix7kI38KgtUXuMzNVX5puyA8/N+
AlVJoOJMMyf2i+HZ27q6eJHDeTLTmzJCMhEiNykCgYEAya+B8/M6WY0OUD2rKoHr
TqiiORb7jvqAix/nowm8E2DffobCtzLTL8KsANVl1zdnZtNecUER7B8hMm1FmWaX
lg8lpX/J0WjJRklh4uV7Ut5QygYRFNlCRdqjInGrMouu/vYyJ6NK/DF6zLDeavZ2
yYa5W6JvhSqG2sM3Kk6GLOk=
-----END PRIVATE KEY-----`,
  }),
});

const db = admin.firestore();

// WEBHOOK
app.post("/webhook", async (req, res) => {
  try {
    // 🔥 CORREÇÃO PRINCIPAL
    const event = JSON.parse(req.body.toString());

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const email = session.customer_details?.email;
      const amount = session.amount_total;

      let plano = "free";
      let limite = 3;

      if (amount === 990) {
        plano = "starter";
        limite = 20;
      }

      if (amount === 1990) {
        plano = "pro";
        limite = 100;
      }

      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).get();

      snapshot.forEach((doc) => {
        doc.ref.update({
          plano: plano,
          limite_diario: limite,
        });
      });

      console.log("Plano atualizado:", email, plano);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("ERRO COMPLETO:", err.stack);
    res.sendStatus(400);
  }
});

// 🔥 IMPORTANTE PRA RAILWAY
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando"));
