// Teste simples para verificar se Jest está configurado corretamente
describe('Configuração do Jest', () => {
  it('deve executar testes básicos', () => {
    expect(1 + 1).toBe(2);
  });

  it('deve ter acesso aos tipos do Jest', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });
});