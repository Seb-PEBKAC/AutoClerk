import { PrismaClient } from "@prisma/client";
import { getModelConfigurations } from "../src/lib/model-config";

const prisma = new PrismaClient();

function convertToCostPerMillionTokens(cost: number): number {
  return cost * 1_000_000;
}

async function main() {
  const modelConfigurations = getModelConfigurations();

  for (const [provider, models] of Object.entries(modelConfigurations)) {
    for (const [model, config] of Object.entries(models)) {
      if (config && "inputTokenCost" in config && "outputTokenCost" in config) {
        await prisma.modelCost.upsert({
          where: {
            provider_model_validFrom: {
              provider,
              model,
              validFrom: new Date(),
            },
          },
          update: {
            inputTokenCost: convertToCostPerMillionTokens(
              config.inputTokenCost,
            ),
            outputTokenCost: convertToCostPerMillionTokens(
              config.outputTokenCost,
            ),
          },
          create: {
            provider,
            model,
            inputTokenCost: convertToCostPerMillionTokens(
              config.inputTokenCost,
            ),
            outputTokenCost: convertToCostPerMillionTokens(
              config.outputTokenCost,
            ),
            validFrom: new Date(),
          },
        });
      }
    }
  }

  // Add Cerebras models
  await prisma.modelCost.createMany({
    data: [
      {
        provider: "cerebras",
        model: "llama-3.3-70b",
        inputTokenCost: 0.5, // Cost per million tokens
        outputTokenCost: 0.5, // Cost per million tokens
        validFrom: new Date(),
      },
      {
        provider: "cerebras",
        model: "llama3.1-8b",
        inputTokenCost: 0.2,
        outputTokenCost: 0.2,
        validFrom: new Date(),
      },
      {
        provider: "cerebras",
        model: "llama3.1-70b",
        inputTokenCost: 0.4,
        outputTokenCost: 0.4,
        validFrom: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
