const express = require("express");
const admin = require("firebase-admin");

const app = express();

app.use(express.raw({ type: "application/json" }));

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "gen-lang-client-0021932981",
    clientEmail: "firebase-adminsdk-fbsvc@gen-lang-client-0021932981.iam.gserviceaccount.com",
    privateKey: `-----BEGIN PRIVATE KEY-----
\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCsqjmeb4bV9LEr\nuf0pmTkl3ui/N/CUj0C5X0UY0YR4MHTPr685NBe1GLvOd/DO2bHXOZutb95SK/R2\n4dM97Et5n1d2uXAKkua8pOmWj15uBy4GrctBWN/kxjYEGwIMYZGwpaj0f19oxw7D\nyT00Hfc6o38YpU0hS2C3wDJV10OMGcJWWrM35nTJyxYKiExFkIoAd2RHnCXlYLfW\n1yPkND/vz+FaWCWacPNeLOp7UF5VWFkRE3d0kl2z3wCriVey93SfEfhiXna5ZScD\naqkh6cE9qq6l3xvFGQNMIJBm3MBgnL1+Pc2MrXw5Q2MOrST1yiHuvsa0Ictu5QS8\n47DEElnlAgMBAAECggEAAX1oiN7yfWcinjt5HUJGtXZycK/1YfrIdrEFQh0QtQ7J\n+z7LVsWFzNi9Sh9L0yUavT4wgzMban8ZmWsCbR7cWdzPnuUju9ufpRIRN+zdxjpG\noeUfA13WdL1nGur2vg+bd7g+OHne42MQVA0o+4mkp/tgLeDDRR3G5F8CsC3u1cch\nfpefHEVQ4eOBe/KTZiVQQFJOTU7hOmv/I4yXGRee8iq/OKYB8AqFcJeP1yjzEc8d\nUxxoJ59ml6WUcJMKGMCxnAle59SxCJ31LQFFxr2O9ntflWm1k01hnr2jFz2kZeI9\ncnUIODVY54KT35zY0T20MPCUyXeRALlaGdhC5J3BYwKBgQDW1f+ddI/nYzRZq64q\ngcqIZzQCn0qRZMtj5JcqMWlX4y6JtiGICx/Zo+mgd4/L8dXDj71rn/5PsaW1lFyF\nZId3DbTgCoeD/9AnlosXRcPBgPuMloaU2cIgT4/wIIO240N/uC4YPSBvX1f4rZlh\nHv3p3CUCKMiDCdFaxKNEZLI3XwKBgQDNv65KGShO1gC5cvhOQUz03LBs7F4DRsM/\nx9GtVh31f/sG4ecg0eG+6R2+77PK29gVSjqJqq3C1unOTYIT0K7AWXbsywHKEaKs\nJV7gZZ3fH+YbI8+Xb//HFyhbEUbdyuxxvpntVhW2rVZN/9+8jltNSM0L0n0POTsg\ntqxIqjrJOwKBgQCFS/ww3vzWrbfyl1IWL7fRkG813U3wDmEgFtowJL5e+KeMbIQ7\nm+NkL46qsOR4vxFKKKp316p8GhZeJrKNVYWzub5rcD0LCrNFjOO6SeAe9P+fCFpy\nivYnBBakABiZZkMgQM/g3DR+xeKYemX7W7Zh3uTbhSB8JaBPOEixC+WD8wJ/WgOC\nPOjEubjmmDu0ZogrIvVqOj0u5EARK9Y/5ZXHhaB4Moqik7k/CkbyvJYiEp4b6zSO\nZ6xEWPmtUJSYVBL4YS7C2NX38m/Eu4ud9o5+gx9xjG4eZCKbxH5dKXplhqNAzoKU\n1UDUPxeWqolHWTbuuuEe1A1CqWZgd+9zcFcJYQKBgQDIlFgf0xSTLsn3i/rhrLoM\n8I40qpQQM/kGxgVtrUxkCKUfkwr5gfSW7gNPhhzDindLGowwPbw03xFKz5silaBC\n+0pSQp09yQVYuQ2GXm64zwUiVnqTL7FD1VbUd80MSVeoIQtdvMEKjViGfPf3T8my\n84RjQjV4kRlas7CmFtJfew==\n-----END PRIVATE KEY-----\n
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
