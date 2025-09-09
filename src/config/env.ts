import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform(Number).default("3333"),
  DATABASE_URL: z.string().min(5, "DATABASE_URL é obrigatório"),
  NODE_ENV: z.enum(["dev", "teste", "prod"], {
    message: "O Node ENV deve ser dev, teste ou prod",
  }),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Variáveis de ambiente INVÁLIDAS");
  process.exit(1);
}

export const env = _env.data;
