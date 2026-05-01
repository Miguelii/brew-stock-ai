# Token Economics & Profit Analysiss

## Pacotes de Tokens

| Pacote  | Tokens | Preço  | Preço/token | Após Stripe (2.9% + €0.30) | Líquido/token |
| ------- | ------ | ------ | ----------- | -------------------------- | ------------- |
| Starter | 5      | €2.50  | €0.50       | €2.128                     | **€0.426**    |
| Pro     | 15     | €5.99  | €0.40       | €5.516                     | **€0.368**    |
| Expert  | 50     | €14.99 | €0.30       | €14.555                    | **€0.291**    |

> ⚠️ A taxa fixa do Stripe (€0.30) pesa proporcionalmente mais no Starter — representa **12%** da receita bruta sozinha. Por isso o Starter tem a pior margem líquida por token, mas serve como produto de entrada (impulse purchase <€3).

---

## Custo API por Análise

Modelo: `claude-sonnet-4-5-20250929` com extended thinking (`budgetTokens: 8000`, `maxOutputTokens: 12000`)

**Pricing Anthropic:**

- Input: $3.00 / MTok → ~€2.76 / MTok
- Output (inclui thinking): $15.00 / MTok → ~€13.80 / MTok

### Estimativas de tokens por tipo

| Análise                   | Créditos | Input | Thinking | Output | **Custo API (€)** |
| ------------------------- | -------- | ----- | -------- | ------ | ----------------- |
| Full Wall Street Style    | 2        | ~400  | ~6 500   | ~3 000 | **€0.136**        |
| Deep Financial Breakdown  | 2        | ~380  | ~5 500   | ~2 300 | **€0.113**        |
| Moat Analysis             | 1        | ~350  | ~3 500   | ~1 700 | **€0.073**        |
| Risk Analysis             | 1        | ~360  | ~3 000   | ~1 700 | **€0.066**        |
| Growth Potential Analysis | 1        | ~350  | ~3 500   | ~1 700 | **€0.073**        |

> Conversão usada: 1 USD ≈ 0.92 EUR

---

## Lucro por Análise × Pacote

### Full Wall Street Style — 2 créditos | custo API €0.136

| Pacote  | Receita (2× líq.) | Custo API | Lucro      | Margem    |
| ------- | ----------------- | --------- | ---------- | --------- |
| Starter | €0.852            | €0.136    | **€0.716** | **84.0%** |
| Pro     | €0.736            | €0.136    | **€0.600** | **81.5%** |
| Expert  | €0.582            | €0.136    | **€0.446** | **76.6%** |

### Deep Financial Breakdown — 2 créditos | custo API €0.113

| Pacote  | Receita (2× líq.) | Custo API | Lucro      | Margem    |
| ------- | ----------------- | --------- | ---------- | --------- |
| Starter | €0.852            | €0.113    | **€0.739** | **86.7%** |
| Pro     | €0.736            | €0.113    | **€0.623** | **84.6%** |
| Expert  | €0.582            | €0.113    | **€0.469** | **80.6%** |

### Moat Analysis — 1 crédito | custo API €0.073

| Pacote  | Receita (1× líq.) | Custo API | Lucro      | Margem    |
| ------- | ----------------- | --------- | ---------- | --------- |
| Starter | €0.426            | €0.073    | **€0.353** | **82.9%** |
| Pro     | €0.368            | €0.073    | **€0.295** | **80.2%** |
| Expert  | €0.291            | €0.073    | **€0.218** | **74.9%** |

### Risk Analysis — 1 crédito | custo API €0.066

| Pacote  | Receita (1× líq.) | Custo API | Lucro      | Margem    |
| ------- | ----------------- | --------- | ---------- | --------- |
| Starter | €0.426            | €0.066    | **€0.360** | **84.5%** |
| Pro     | €0.368            | €0.066    | **€0.302** | **82.1%** |
| Expert  | €0.291            | €0.066    | **€0.225** | **77.3%** |

### Growth Potential Analysis — 1 crédito | custo API €0.073

| Pacote  | Receita (1× líq.) | Custo API | Lucro      | Margem    |
| ------- | ----------------- | --------- | ---------- | --------- |
| Starter | €0.426            | €0.073    | **€0.353** | **82.9%** |
| Pro     | €0.368            | €0.073    | **€0.295** | **80.2%** |
| Expert  | €0.291            | €0.073    | **€0.218** | **74.9%** |

---

## Resumo: Pior e Melhor Caso

| Cenário                                           | Receita | Custo API | Lucro       | Margem     |
| ------------------------------------------------- | ------- | --------- | ----------- | ---------- |
| **Melhor** — Starter + Deep Financial (2 cred.)   | €0.852  | €0.113    | **€0.739**  | **86.7%**  |
| **Pior** — Expert + Moat/Growth (1 cred.)         | €0.291  | €0.073    | **€0.218**  | **74.9%**  |
| **Médio típico** — Pro + misto (1.3 cred. médios) | ~€0.478 | ~€0.087   | **~€0.391** | **~81.8%** |

> O pior caso (Expert + análise de 1 crédito) está em **74.9%**, ligeiramente abaixo do benchmark SaaS de 75–80%. Ainda aceitável, mas é o cenário a monitorizar.

---

## Impacto da Taxa Fixa do Stripe no Starter

O Starter a €2.50 é o pacote mais vulnerável à taxa fixa de €0.30:

```
Receita bruta:        €2.50
Stripe (2.9% + €0.30): €0.373
Receita líquida:      €2.128  →  apenas 85.1% da bruta
```

Para comparação, no Expert (€14.99):

```
Receita bruta:        €14.99
Stripe (2.9% + €0.30): €1.035
Receita líquida:      €13.955  →  93.1% da bruta
```

**Conclusão:** o Starter perde ~15% para o Stripe; o Expert perde apenas ~7%. Isto reforça a ideia de usar o Starter como produto de entrada e o Expert como produto de margem.

---

## Outros Custos Operacionais

| Custo               | Por análise       | Nota                                |
| ------------------- | ----------------- | ----------------------------------- |
| Trigger.dev compute | ~€0.002–0.005     | Task de ~30–90s em `small-1x`       |
| Vercel              | ~€0.001–0.003     | Negligível até escala considerável  |
| Supabase            | ~€0.000–0.001     | Free tier: ~50K análises/mês        |
| **Total infra**     | **~€0.003–0.009** | <1% da receita em todos os cenários |

---

## Projeção Mensal (hipotético)

Mix: 40% Starter / 35% Pro / 25% Expert. Média de créditos por análise: 1.3 (70% análises de 1 crédito, 30% de 2 créditos).

| Utilizadores | Análises/mês | Receita bruta | Stripe fees | Custo API | **Lucro bruto** | **Margem** |
| -----------: | -----------: | ------------: | ----------: | --------: | --------------: | ---------- |
|           50 |          150 |           €86 |         €16 |       €13 |         **€57** | **66%**    |
|          200 |          600 |          €346 |         €52 |       €52 |        **€242** | **70%**    |
|          500 |        1 500 |          €865 |        €108 |      €131 |        **€626** | **72%**    |
|        2 000 |        6 000 |        €3 460 |        €388 |      €522 |      **€2 550** | **74%**    |

> A margem sobe com a escala porque o custo fixo do Stripe (€0.30/compra) representa menos por análise à medida que os utilizadores compram pacotes maiores e fazem mais análises por compra.

---

## Considerações Estratégicas

### 1. O Starter a €2.50 é um risco calculado

- Vantagem: fricção mínima para o primeiro utilizador pagar → conversão mais alta
- Desvantagem: margem mais fraca (€0.218–€0.353/análise no Expert)
- **Recomendação:** aceitar, mas considerar aumentar para €2.99 se a conversão do Expert for baixa

### 2. O Expert é o produto de margem real

- €14.99 por 50 tokens: taxa Stripe é apenas 7% da receita
- Um utilizador Expert que faz 10 análises/mês gera €2.91 de receita, €0.87 de custo total → **€2.04 de lucro**

### 3. Risco principal: não é o custo AI

- Custo AI = €0.066–0.136 por análise (controlável, previsível)
- **Risco real:** utilizadores que compram Starter e nunca mais voltam → CAC não recuperado
- **Mitigação:** adicionar e-mail de reengagement quando os créditos chegam a 0

### 4. Próximo passo natural: subscrição mensal

- Ex: €9.99/mês → 20 tokens + 10% de desconto em compras extra
- Garante receita recorrente e reduz a taxa Stripe por token
- Margem previsível mesmo com mix de análises variável
