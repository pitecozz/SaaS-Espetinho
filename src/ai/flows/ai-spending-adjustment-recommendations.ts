'use server';
/**
 * @fileOverview Fornece recomendações de ajuste de gastos geradas por IA para microempreendedores.
 *
 * - aiSpendingAdjustmentRecommendations - Função que fornece recomendações de ajuste de gastos.
 * - AiSpendingAdjustmentInput - O tipo de entrada para a função aiSpendingAdjustmentRecommendations.
 * - AiSpendingAdjustmentOutput - O tipo de retorno para a função aiSpendingAdjustmentRecommendations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiSpendingAdjustmentInputSchema = z.object({
  businessType: z.string().describe('O tipo de microempresa (ex: "espetinho", "food truck", "loja online").'),
  currentRevenue: z.number().describe('A receita total mensal atual do negócio.'),
  currentExpenses: z.number().describe('As despesas totais mensais atuais do negócio.'),
  currentNetProfit: z.number().describe('O lucro líquido mensal atual do negócio.'),
  detailedExpenses: z.string().optional().describe('Um detalhamento opcional das despesas mensais atuais.'),
  financialGoal: z.string().describe('O objetivo financeiro específico do empreendedor (ex: "aumentar lucro em 20%", "economizar R$ 500").'),
});
export type AiSpendingAdjustmentInput = z.infer<typeof AiSpendingAdjustmentInputSchema>;

const AiSpendingAdjustmentOutputSchema = z.object({
  summary: z.string().describe('Um resumo geral das recomendações de ajuste de gastos.'),
  recommendations: z.array(z.object({
    category: z.string().describe('A categoria de gastos para ajustar (ex: "Marketing", "Suprimentos", "Pessoal", "Utilidades", "Aluguel").'),
    adjustmentType: z.enum(['reduce', 'increase', 'reallocate']).describe('O tipo de ajuste recomendado (reduzir, aumentar, realocar).'),
    amountOrPercentage: z.string().describe('O valor ou porcentagem sugerido para ajuste (ex: "R$ 100", "15%", "realocar 20% de X para Y").'),
    rationale: z.string().describe('A explicação do porquê esta recomendação está sendo feita.'),
    expectedImpact: z.string().describe('O impacto financeiro antecipado se esta recomendação for seguida.'),
  })).describe('Uma lista de recomendações específicas de ajuste de gastos.'),
});
export type AiSpendingAdjustmentOutput = z.infer<typeof AiSpendingAdjustmentOutputSchema>;

export async function aiSpendingAdjustmentRecommendations(input: AiSpendingAdjustmentInput): Promise<AiSpendingAdjustmentOutput> {
  return aiSpendingAdjustmentRecommendationsFlow(input);
}

const aiSpendingAdjustmentPrompt = ai.definePrompt({
  name: 'aiSpendingAdjustmentPrompt',
  input: { schema: AiSpendingAdjustmentInputSchema },
  output: { schema: AiSpendingAdjustmentOutputSchema },
  prompt: `Você é um consultor financeiro especialista para microempreendedores. Seu objetivo é fornecer recomendações de ajuste de gastos acionáveis e personalizadas para ajudar o dono do negócio a atingir seus objetivos financeiros.

O negócio é uma microempresa do tipo: {{{businessType}}}.

Aqui está a situação financeira atual:
- Receita Mensal Atual: R$ {{{currentRevenue}}}
- Despesas Mensais Atuais: R$ {{{currentExpenses}}}
- Lucro Líquido Mensal Atual: R$ {{{currentNetProfit}}}

Detalhamento opcional de despesas:
{{{detailedExpenses}}}

O objetivo financeiro do empreendedor é: "{{{financialGoal}}}"

Com base nas informações acima, forneça recomendações claras, concisas e acionáveis para ajustar os gastos. Foque em conselhos práticos adequados para um microempreendedor. Cada recomendação deve incluir:
1. **Categoria**: A área específica de gastos para ajustar.
2. **Tipo de Ajuste**: Se deve 'reduzir' (reduce), 'aumentar' (increase) ou 'realocar' (reallocate) o gasto.
3. **Valor ou Porcentagem**: Uma sugestão concreta para o ajuste.
4. **Justificativa**: Uma breve explicação para a recomendação.
5. **Impacto Esperado**: O que o empreendedor pode esperar ganhar ou evitar seguindo a recomendação.

Finalmente, forneça um resumo geral de suas recomendações em português brasileiro.`,
});

const aiSpendingAdjustmentRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiSpendingAdjustmentRecommendationsFlow',
    inputSchema: AiSpendingAdjustmentInputSchema,
    outputSchema: AiSpendingAdjustmentOutputSchema,
  },
  async (input) => {
    const { output } = await aiSpendingAdjustmentPrompt(input);
    return output!;
  }
);