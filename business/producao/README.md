# Pasta de Producao — Incubadora de Expert

> Aqui ficam os arquivos de video e assets de cada produto antes de subir na Hotmart.
> Mantida pelo Course Publisher (`/course-publisher`).

---

## Estrutura

```
producao/
└── {produto-slug}/
    ├── M0/                    videos do Modulo 0 (nomeados em ordem)
    ├── M1/                    videos do Modulo 1
    ├── M2/
    ├── M3/
    ├── M4/
    ├── modulo-orientacoes/    videos do Modulo de Orientacoes
    ├── descricoes.md          gerado pelo Course Creator — descricoes de cada aula
    └── assets/                gerado automaticamente pelo Course Publisher
        ├── capas-modulos/     PNG 1920x1080 — uma por modulo
        ├── thumbnails/        PNG 1280x720 — uma por aula
        ├── banners/           PNG vitrine desktop (1920x800) e mobile (720x960)
        └── certificado/       PNG 2480x3508
```

---

## Convencao de nome dos videos

Prefixo numerico + nome descritivo + extensao:

```
00-intro.mp4
01-fracasso-como-prova.mp4
02-historia-real.mp4
03-ikigai.mp4
```

O Course Publisher transforma automaticamente:
`01-fracasso-como-prova.mp4` → titulo na Hotmart: **Fracasso como Prova**

---

## Produtos ativos

| Produto | Slug | Status |
|---------|------|--------|
| Expert360º | expert360 | Em preparacao |

---

## Como usar

1. Coloque os videos nas pastas de cada modulo seguindo a convencao de nome
2. O Course Creator gera o `descricoes.md`
3. Ative o Course Publisher: `/course-publisher`
4. Diga: "publica o Expert360" — worker faz o resto
