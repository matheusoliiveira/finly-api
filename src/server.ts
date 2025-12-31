import { env } from "./config/env";
import app from "./app";
import { prismaConnect } from "./config/prisma";
import { initializeGlobalCategories } from "./services/globalCategories.service";
import initializeFirebaseAdmin from "./config/firebase";

const PORT = Number(env.PORT) || 10000;
const HOST = "0.0.0.0";

initializeFirebaseAdmin();

const startServer = async () => {
  try {
    await prismaConnect();
    await initializeGlobalCategories();

    await app.listen({ port: PORT, host: HOST });

    console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
  } catch (err) {
    console.error("❌ Erro ao iniciar servidor:", err);
    process.exit(1);
  }
};

startServer();
