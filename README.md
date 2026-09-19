# Ótica Vitturino

Sistema de gestão e fidelização da ótica: painel web para a administradora, aplicativo para o cliente e API única.

A documentação completa — visão de negócio, requisitos, fases de implementação, arquitetura, MER/DER e contrato da API — está em **[DOCUMENTACAO.md](DOCUMENTACAO.md)**.

## O que tem neste repositório

| Pasta | O quê |
|---|---|
| `WEB/BACK/main` | API Java 21 / Spring Boot |
| `WEB/FRONT` | Painel administrativo (React + Vite) |
| `mobile` | Aplicativo do cliente (Expo / React Native) |

## Subir o ambiente

1. Copie `example.env` para `.env` e preencha as variáveis.
2. Na raiz:

```bash
docker compose up --build
```

- Painel: `http://localhost`
- API: `http://localhost:8080`

Detalhes de execução local, EAS, segurança e evolução do sistema: veja a [DOCUMENTACAO.md](DOCUMENTACAO.md).
