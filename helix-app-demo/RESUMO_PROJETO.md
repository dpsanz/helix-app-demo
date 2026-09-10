# Resumo do projeto Helix

## Visão geral

O projeto é uma aplicação web demonstrativa feita com **React**, **TypeScript**, **Vite** e **Tailwind CSS**. Ela representa o início de um portal de perfil genômico da Unimed, com páginas de login, cadastro, perfil e portal médico.

A autenticação ainda é simulada: ao enviar o formulário de login, a aplicação grava uma informação no `localStorage` e redireciona o usuário para a página de perfil. Não existe integração com API ou banco de dados.

## Estrutura dos arquivos

```text
helix-app-demo/
├── public/
│   ├── favicon.svg
│   ├── favicon-dark.svg
│   └── logo.svg
├── src/
│   ├── assets/
│   │   ├── logo dark.png
│   │   └── logo light.png
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useTheme.ts
│   ├── pages/
│   │   ├── Auth/Login.tsx
│   │   ├── Cadastro/Cadastro.tsx
│   │   ├── Perfil/Perfil.tsx
│   │   └── PortalMedico/PortalMedico.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Resumo por arquivo

### Arquivos principais

- `src/main.tsx`: ponto de entrada da aplicação. Renderiza o componente `App` dentro do elemento `#root`.
- `src/App.tsx`: define as rotas da aplicação e decide se a rota inicial mostra o login ou redireciona para o perfil.
- `src/index.css`: carrega o Tailwind, define as cores personalizadas da identidade Helix e os estilos globais da página.
- `src/App.css`: reúne os estilos específicos da interface, principalmente o fundo, cartão, campos e botões da tela de login. Também contém alguns estilos remanescentes do template inicial.

### Hooks

- `src/hooks/useAuth.ts`: controla uma autenticação local simples, oferecendo as funções `login` e `logout` e o estado `isAuthenticated`.
- `src/hooks/useTheme.ts`: controla os temas claro e escuro, aplica a classe `dark` no HTML e salva a escolha no `localStorage`.

### Páginas

- `src/pages/Auth/Login.tsx`: tela de login com CPF/e-mail, senha, opções de acesso e link para cadastro. Atualmente aceita qualquer preenchimento, pois não valida credenciais.
- `src/pages/Cadastro/Cadastro.tsx`: página provisória que exibe apenas o texto “Cadastro”.
- `src/pages/Perfil/Perfil.tsx`: página provisória que exibe apenas o texto “Perfil”.
- `src/pages/PortalMedico/PortalMedico.tsx`: página provisória que exibe apenas o texto “Portal Medico”.

### Recursos visuais

- `public/logo.svg`: logo usada diretamente na tela de login.
- `public/favicon.svg` e `public/favicon-dark.svg`: ícones do site; o HTML usa atualmente a versão escura.
- `src/assets/logo dark.png` e `src/assets/logo light.png`: versões da logo para fundos diferentes, ainda não importadas pelos componentes atuais.

### Configuração

- `package.json`: lista dependências e comandos para desenvolvimento, build, lint e preview.
- `package-lock.json`: fixa as versões exatas das dependências instaladas.
- `vite.config.ts`: ativa os plugins do React e do Tailwind no Vite.
- `tsconfig.json`: centraliza as referências das configurações TypeScript.
- `tsconfig.app.json`: configura a compilação TypeScript do código da aplicação.
- `tsconfig.node.json`: configura o TypeScript usado pelo arquivo de configuração do Vite.
- `eslint.config.js`: define regras de qualidade para TypeScript, React Hooks e atualização rápida do Vite.
- `index.html`: documento HTML base, com título, favicon e o elemento onde o React é carregado.
- `README.md`: documentação padrão criada pelo template React + Vite; ainda não descreve especificamente o projeto Helix.

## Fluxo atual

1. A aplicação abre na rota `/`.
2. Se não houver login salvo, mostra a página de login.
3. Ao enviar o formulário, salva `helix_loged_in = true` no navegador.
4. O usuário é redirecionado para `/perfil`.
5. As páginas de cadastro, perfil e portal médico ainda são apenas estruturas iniciais.

## Observações rápidas

- As rotas internas ainda não estão protegidas; é possível acessá-las diretamente sem login.
- O hook de tema está pronto, mas ainda não está sendo utilizado nas páginas.
- O projeto está em uma fase inicial, com a tela de login mais desenvolvida que as demais.
