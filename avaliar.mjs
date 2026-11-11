/**
 * Correção automática — Avaliativo B3-01: Contador
 *
 * O HTML é fixo; o aluno edita js/script.js. Verifica o COMPORTAMENTO
 * (clicar nos botões e conferir o número) num navegador real.
 *
 * Uso:  node avaliar.mjs [pastaDoAluno]
 */

import path from "node:path";
import { avaliar, exigir } from "./lib/avaliador.js";

const args = process.argv.slice(2);
const formato = args.includes("--json") ? "json" : "texto";
const pastaAluno = path.resolve(args.find((a) => !a.startsWith("--")) ?? ".");

const txt = (pagina) => pagina.locator("#total").textContent().then((t) => (t ?? "").trim());

const { nota } = await avaliar({
  titulo: "Avaliativo B3-01 — Contador (JavaScript)",
  pastaAluno,
  formato,
  verificacoes: ({ pagina, errosDeConsole }) => [
    {
      nome: 'Ao carregar, o #total mostra "0"',
      pontos: 15,
      executar: async () => {
        const v = await txt(pagina);
        exigir(v === "0", `o #total mostra "${v}" — o JavaScript deve iniciar em 0`);
      },
    },
    {
      nome: 'Clicar em "Somar" uma vez mostra "1"',
      pontos: 20,
      executar: async () => {
        await pagina.click("#somar");
        const v = await txt(pagina);
        exigir(v === "1", `após 1 clique o #total é "${v}" — deveria ser "1"`);
      },
    },
    {
      nome: 'Clicar mais duas vezes mostra "3"',
      pontos: 20,
      executar: async () => {
        await pagina.click("#somar");
        await pagina.click("#somar");
        const v = await txt(pagina);
        exigir(v === "3", `o #total é "${v}" — deveria ser "3"`);
      },
    },
    {
      nome: 'Clicar em "Zerar" volta para "0"',
      pontos: 20,
      executar: async () => {
        await pagina.click("#zerar");
        const v = await txt(pagina);
        exigir(v === "0", `após zerar o #total é "${v}" — deveria ser "0"`);
      },
    },
    {
      nome: 'Depois de zerar, "Somar" volta a funcionar (mostra "1")',
      pontos: 15,
      executar: async () => {
        await pagina.click("#somar");
        const v = await txt(pagina);
        exigir(v === "1", `após zerar e somar o #total é "${v}" — deveria ser "1"`);
      },
    },
    {
      nome: "O JavaScript roda sem erros",
      pontos: 10,
      executar: async () => exigir(errosDeConsole.length === 0, `erro de JavaScript: ${errosDeConsole[0]}`),
    },
  ],
});

process.exit(formato === "json" || nota === 100 ? 0 : 1);
