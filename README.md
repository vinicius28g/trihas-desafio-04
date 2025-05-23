
# Projeto Trilhas Inova – Desafio 04

**Tema:** Acesso à Educação Básica no Brasil  
**Proposta:** Criar uma solução digital composta por uma landing page institucional e uma dashboard interativa para apresentar dados públicos educacionais de forma clara, acessível e visualmente atrativa.

🔗 [Acesse o projeto online](https://trihas-desafio-04.vercel.app/)

---
![tenor (1)](https://github.com/user-attachments/assets/50f0d4da-9d63-4ece-a1c9-582f67c1d45b)

---

## Objetivo

O projeto tem como foco principal **facilitar o acesso e a interpretação de dados públicos sobre a educação básica no Brasil**, com ênfase no estado do Maranhão. A ideia é fornecer uma ferramenta visual e acessível para ONGs, educadores, gestores públicos e cidadãos em geral.

---

## 🌐 Funcionalidades

### Landing Page
- Apresentação do projeto e equipe
- Visual da dashboard
- Botão de acesso à análise interativa
- Design responsivo

### Dashboard de Indicadores
- Gráficos interativos com dados educacionais:
  - IDEB (Índice de Desenvolvimento da Educação Básica)
  - INSE (Indicador Socioeconômico)
  - ENEM (Desempenho médio por cidade e região)
- Visualização por estado, cidade e região
- Dados extraídos da API [QEdu](https://api.qedu.org.br)

---

## 🛠 Tecnologias Utilizadas

- **HTML5** 
- **CSS3**
- **JavaScript**
- **Bootrap**
- **Higcharts** – para gráficos interativos
- **Vercel** – hospedagem

---

## Estrutura do Projeto

```text
├── index.html                # Landing Page
├── projeto.html              # Detalhamento da proposta
├── indicadores.html          # Dashboard com gráficos educacionais
├── equipe.html               # Apresentação da equipe
├── encontrara.html           # Página de direcionamento ou busca
├── style.css                 # Estilos globais
├── js/
│   ├── graficoEnem.js
│   ├── graficoIdebEstado.js
│   ├── graficoInse.js
│   ├── graficosIdeb.js
│   └── script.js
├── assets/img/              # Imagens e elementos gráficos
└── exemplosGraficos/        # Testes com gráficos e mapas
```

---

## Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/vinicius28g/trihas-desafio-04.git

# Acesse a pasta do projeto
cd trihas-desafio-04

# Abra o arquivo index.html em seu navegador
```

Ou, se estiver usando o VS Code:

```bash
# Instale a extensão Live Server (se ainda não tiver)
# Clique com o botão direito no arquivo index.html
# Selecione "Open with Live Server"
```

---

## 👥 Equipe

### Front-End
- **Alice Torres** – Desenvolvimento de gráficos  
- **Maria Delmondes** – Gráficos e documentação técnica  
- **Renato** – Desenvolvimento de páginas HTML e CSS  
- **Vinicius** – Dados, testes, responsividade, lógica JS  

### UX Design
- **Rhouseanne Cristine** – Wireframe da landing page e dashboard  
- **Matheus Moraes** – Prototipação  
- **Rhuan Fellype** – Pesquisa e análise do problema  

> Todos participaram ativamente de todas as etapas: pesquisa, design, desenvolvimento, testes e documentação.

---

## Fontes de Dados

- [QEdu API](https://api.qedu.org.br)
- INEP – Instituto Nacional de Estudos e Pesquisas Educacionais
- Censo Escolar da Educação Básica
- IBGE – Instituto Brasileiro de Geografia e Estatística

---

## 📝 Licença

Este projeto está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT).  
Sinta-se livre para usar, modificar e compartilhar.

---



