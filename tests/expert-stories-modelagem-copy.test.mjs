import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8");
test("Stories seguem modelos, não mostram valores e chamam grupo 2x",()=>{
 const rotina=read("docs/producao-conteudo/karol/rotina-stories-formatos.md");
 const task=read("agents/expert-stories/tasks/generate-story.md");
 const rules=read("agents/expert-stories/data/expert-stories-rules.md");
 const play=read("agents/expert-stories/data/expert-stories-playbook.md");
 for(const s of [rotina,task,rules]) assert.match(s,/persona.*dor.*problema.*causa real.*solução.*CTA/is);
 for(const s of [rotina,task,rules,play]) assert.match(s,/não mostrar preço|NUNCA mostrar preço|zero preço/i);
 assert.match(rotina,/Segunda e quarta antes da live/);
 assert.match(rules,/sequência extra/);
 assert.match(play,/Comenta GRUPO que eu te mando o link/);
 assert.ok(fs.existsSync("docs/producao-conteudo/karol/referencias-stories/2026-09-08-modelo-chamada-grupo-lives.jpg"));
 assert.ok(!fs.existsSync("docs/producao-conteudo/karol/referencias-reacts/2026-09-08-sequencia-zoom-funil-de-audio.md"));
});
