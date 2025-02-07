# Sistema de Prontuário Médico

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

### Server (Backend)
- Node.js + Express
- TypeScript
- MongoDB com Mongoose
- JWT para autenticação
- Bcrypt para criptografia
- Cors para segurança
- Express-validator para validação
- Winston para logging
- Dotenv para variáveis de ambiente

### Client (Frontend)
- React 18
- TypeScript
- Material-UI (MUI) para interface
- React Query para gerenciamento de estado e cache
- React Router para navegação
- Axios para requisições HTTP
- React Hook Form para formulários
- Yup para validação
- Date-fns para manipulação de datas
- React-to-print para impressão de documentos

## Funcionalidades Principais
- Cadastro e autenticação de usuários (médicos, enfermeiros, administradores)
- Gestão de pacientes
- Registro de consultas e procedimentos
- Histórico médico completo
- Prescrições médicas
- Exames e resultados
- Agendamento de consultas
- Relatórios e estatísticas
- Impressão de documentos

## Requisitos
- Node.js 18+
- MongoDB 6+
- npm ou yarn

## Instalação

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Segurança
- Autenticação JWT
- Criptografia de dados sensíveis
- Conformidade com LGPD
- Logs de auditoria
- Backup automático
