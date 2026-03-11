# medi-life

## API

Base URL: `/api`

### Health

- `GET /health`

Resposta:

```json
{
	"status": "OK",
	"database": "Conectado"
}
```

---

## Auth

### Login

- `POST /api/auth/login`

Body:

```json
{
	"email": "usuario@clinica.com",
	"senha": "123456"
}
```

Resposta `200`:

```json
{
	"usuario": {
		"id": "uuid",
		"nome": "Nome",
		"email": "usuario@clinica.com",
		"perfil": "ADMIN"
	},
	"token": "jwt"
}
```

Erros comuns: `400`, `401`, `404`, `500`.

---

## Usuários

### Cadastrar usuário

- `POST /api/usuarios/cadastro`

Body mínimo:

```json
{
	"consultorio": "uuid",
	"nome": "Nome do usuário",
	"email": "usuario@clinica.com",
	"senha": "123456",
	"perfil": "uuid",
	"criado_por": "uuid"
}
```

Resposta: `201` com objeto do usuário criado.

### Listar ativos

- `GET /api/usuarios/ativos`

Resposta: `200` com lista de usuários ativos.

### Buscar por ID

- `GET /api/usuarios/:id`

Resposta: `200` com usuário.

### Atualizar usuário

- `PUT /api/usuarios/:id`

Campos aceitos:
- `nome`
- `email`
- `telefone`
- `status`
- `cro`
- `avatar`
- `configuracoes`

Resposta: `200` com usuário atualizado.

### Suspender usuário

- `PATCH /api/usuarios/:id/suspender`

Body:

```json
{
	"motivo": "Descrição da suspensão"
}
```

Resposta: `200` com usuário suspenso.

### Excluir usuário (soft delete)

- `DELETE /api/usuarios/:id`

Body opcional:

```json
{
	"motivo": "Motivo da exclusão"
}
```

Resposta: `200` com usuário marcado como excluído.

---

## Agendamentos

### Listar todos

- `GET /api/agendamentos`

Resposta: `200` com lista de agendamentos.

### Buscar por ID

- `GET /api/agendamentos/:id`

Resposta: `200` com agendamento.

### Listar por paciente

- `GET /api/agendamentos/paciente/:pacienteId`

Resposta: `200` com lista de agendamentos do paciente.

### Criar agendamento

- `POST /api/agendamentos`

Body mínimo:

```json
{
	"consultorio": "uuid",
	"procedimento": "uuid",
	"profissional": "uuid",
	"paciente": "uuid",
	"valor_procedimento": 100,
	"valor_pagar": 80,
	"data": "2026-03-10T14:00:00"
}
```

Campos opcionais: `limite`, `inicio_vigencia`, `fim_vigencia`, `status`.

Resposta: `201` com agendamento criado.

### Atualizar status

- `PATCH /api/agendamentos/:id/status`

Body:

```json
{
	"status": "REALIZADO"
}
```

Status permitidos: `AGENDADO`, `CANCELADO`, `REALIZADO`.

Resposta: `200` com agendamento atualizado.

---

## Relatórios

### Profissionais x atendimentos

- `GET /api/relatorios/profissionais`

Query params opcionais:
- `dataInicio`
- `dataFim`
- `consultorio`

### Faturamento

- `GET /api/relatorios/faturamento`

Query params opcionais:
- `dataInicio`
- `dataFim`
- `consultorio`

---

## Consultórios

### Listar

- `GET /api/consultorios`

Resposta: `200` com lista de consultórios ativos.

### Buscar por ID

- `GET /api/consultorios/:id`

Resposta: `200` com consultório.

### Criar

- `POST /api/consultorios`

Body mínimo:

```json
{
	"razao": "Clínica MedLife"
}
```

Resposta: `201` com consultório criado.

### Atualizar

- `PUT /api/consultorios/:id`

Resposta: `200` com consultório atualizado.

### Excluir (soft delete)

- `DELETE /api/consultorios/:id`

Resposta: `200` com consultório marcado como excluído.

---

## Perfis

### Listar

- `GET /api/perfis`

### Buscar por ID

- `GET /api/perfis/:id`

### Criar

- `POST /api/perfis`

Body mínimo:

```json
{
	"nome": "Administrador",
	"status": "ATIVO"
}
```

### Atualizar

- `PUT /api/perfis/:id`

### Excluir (soft delete)

- `DELETE /api/perfis/:id`

---

## Permissões

### Listar

- `GET /api/permissoes`

### Listar por perfil

- `GET /api/permissoes/perfil/:perfilId`

### Buscar por ID

- `GET /api/permissoes/:id`

### Criar

- `POST /api/permissoes`

Body mínimo:

```json
{
	"nome": "Pacientes",
	"perfil": "uuid"
}
```

### Atualizar

- `PUT /api/permissoes/:id`

### Excluir (soft delete)

- `DELETE /api/permissoes/:id`

---

## Profissionais

### Listar

- `GET /api/profissionais`

### Listar por consultório

- `GET /api/profissionais/consultorio/:consultorioId`

### Buscar por ID

- `GET /api/profissionais/:id`

### Criar

- `POST /api/profissionais`

Body mínimo:

```json
{
	"consultorio": "uuid",
	"nome": "Nome do profissional"
}
```

### Atualizar

- `PUT /api/profissionais/:id`

### Suspender

- `PATCH /api/profissionais/:id/suspender`

Body:

```json
{
	"motivo": "Motivo da suspensão"
}
```

### Excluir (soft delete)

- `DELETE /api/profissionais/:id`

---

## Pacientes

### Listar

- `GET /api/pacientes`

### Listar por consultório

- `GET /api/pacientes/consultorio/:consultorioId`

### Buscar por ID

- `GET /api/pacientes/:id`

### Criar

- `POST /api/pacientes`

Body mínimo:

```json
{
	"consultorio": "uuid",
	"nome": "Nome do paciente"
}
```

### Atualizar

- `PUT /api/pacientes/:id`

### Suspender

- `PATCH /api/pacientes/:id/suspender`

Body:

```json
{
	"motivo": "Motivo da suspensão"
}
```

### Excluir (soft delete)

- `DELETE /api/pacientes/:id`

---

## Procedimentos

### Listar

- `GET /api/procedimentos`

### Buscar por ID

- `GET /api/procedimentos/:id`

### Criar

- `POST /api/procedimentos`

Body mínimo:

```json
{
	"nome": "Limpeza"
}
```

### Atualizar

- `PUT /api/procedimentos/:id`

### Suspender

- `PATCH /api/procedimentos/:id/suspender`

Body:

```json
{
	"motivo": "Motivo da suspensão"
}
```

### Excluir (soft delete)

- `DELETE /api/procedimentos/:id`

---

## Códigos de resposta (padrão)

- `200` sucesso
- `201` criado
- `400` validação/regra de negócio
- `401` credenciais inválidas
- `404` recurso não encontrado
- `500` erro interno