// Script.js

// Função para exibir uma mensagem de confirmação antes de excluir um item
function confirmDelete() {
    return confirm('Deseja realmente excluir?');
  }
  
  // Código para exibir a mensagem de "Cadastro realizado com sucesso" ou de erro no formulário
  const successMessage = document.querySelector('.success-message');
  const errorMessage = document.querySelector('.error-message');
  
  // Verifica se há uma mensagem de sucesso para exibir
  if (successMessage) {
    // Exibe a mensagem por 3 segundos e em seguida remove-a
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 3000);
  }
  
  // Verifica se há uma mensagem de erro para exibir
  if (errorMessage) {
    // Exibe a mensagem por 3 segundos e em seguida remove-a
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 3000);
  }