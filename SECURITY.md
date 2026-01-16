# Política de Segurança

## 🔒 Segurança do NexaSuite ERP

### Reportando Vulnerabilidades
Por favor, **NÃO** reporte vulnerabilidades via issues públicas. 
Envie um email para: security@nexasuite.com

### Medidas Implementadas
- ✅ Criptografia AES-256 para dados sensíveis
- ✅ Hash bcrypt para senhas (12 rounds)
- ✅ JWT com expiração de 24 horas
- ✅ Rate limiting (100 requests/minuto)
- ✅ Prepared statements contra SQL injection
- ✅ Headers de segurança (CSP, HSTS)

### Boas Práticas Recomendadas
1. Use senhas fortes com mais de 12 caracteres
2. Ative 2FA quando disponível
3. Não reutilize senhas entre serviços
4. Mantenha seu token de acesso seguro

### Responsabilidade do Desenvolvedor
Como desenvolvedor, você deve:
- Nunca commitar secrets no repositório
- Usar variáveis de ambiente para configurações sensíveis
- Manter todas as dependências atualizadas
- Realizar testes de segurança regularmente
