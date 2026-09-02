import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('quarta de live sem foto usa slide principal sem pedir input e preserva a janela pós-live', async () => {
  const [task, rules, playbook, persona] = await Promise.all([
    read('agents/expert-stories/tasks/generate-story.md'),
    read('agents/expert-stories/data/expert-stories-rules.md'),
    read('agents/expert-stories/data/expert-stories-playbook.md'),
    read('agents/expert-stories/agents/expert-stories.md'),
  ]);

  for (const [name, content] of Object.entries({ task, rules, playbook, persona })) {
    assert.match(content, /HTML da apresenta[cç][aã]o/i, `${name} precisa apontar para o HTML da live`);
    assert.match(content, /slide\s+(?:que\s+melhor\s+representa|principal)/i, `${name} precisa definir selecao autonoma do slide principal`);
    assert.match(content, /sem\s+(?:parar\s+(?:nem|para)\s+|)pedir\s+(?:input|confirma[cç][aã]o)/i, `${name} nao pode bloquear esperando a Karol escolher asset`);
    assert.match(content, /depois da live/i, `${name} precisa manter o veto de publicacao antes da live`);
  }

  assert.doesNotMatch(
    rules,
    /Se a pasta de assets da semana n[aã]o tiver foto\/v[ií]deo real,\s*perguntar [àa] Karol/i,
    'a regra antiga que bloqueava sem asset deve ser removida',
  );
  assert.doesNotMatch(
    task,
    /Dia tem compromisso fixo n[aã]o confirmado \(live, mentoria, encontro\) \| Perguntar antes/i,
    'quarta de live conhecida nao pode cair no veto generico de confirmacao',
  );
});
