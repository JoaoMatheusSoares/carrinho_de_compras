import React, { useState } from 'react';
import './App.css'; 

function App() {
  // Define os estados do componente
  const [items, setItems] = useState([]); // Armazena os itens no carrinho
  const [newItem, setNewItem] = useState(''); // Armazena o novo item a ser adicionado
  const [newQuantity, setNewQuantity] = useState(1); // Armazena a quantidade do novo item
  const [isEditing, setIsEditing] = useState(false); // Controle se está editando um item
  const [currentItemIndex, setCurrentItemIndex] = useState(null); // Índice do item sendo editado
  const [searchTerm, setSearchTerm] = useState(''); // Armazena o termo de busca
  const [receipt, setReceipt] = useState(null); // Armazena o comprovante
  const [error, setError] = useState(null); // Mensagem de erro
  const [itemError, setItemError] = useState(null); // Estado para erro ao adicionar item

  // Função para adicionar um novo item ao carrinho
  const handleAddItem = () => {
    // Valida se o nome do item e a quantidade são válidos
    if (newItem.trim() === '' || newQuantity <= 0) {
      setItemError('Por favor, insira um nome de item válido!'); 
      return; // Sai da função se houver erro
    }
    
    setItemError(null); // Limpa o erro se tudo estiver certo

    const existingItem = items.find((item) => item.name === newItem); 
    
    if (existingItem && !isEditing) {
      setItems(
        items.map((item) =>
          item.name === newItem
            ? { ...item, quantity: item.quantity + newQuantity } 
            : item
        )
      );
    } else if (isEditing && currentItemIndex !== null) {
      // Item sendo editado, atualiza o item na posição correta
      const updatedItems = [...items];
      updatedItems[currentItemIndex] = { name: newItem, quantity: newQuantity };
      setItems(updatedItems); 
      setIsEditing(false); // Sai do modo de edição
      setCurrentItemIndex(null); // Reseta o índice atual
    } else {
      // Se o item não existe, adiciona um novo item
      setItems([...items, { name: newItem, quantity: newQuantity }]);
    }
    setNewItem(''); 
    setNewQuantity(1); // Reseta a quantidade para 1
  };

  // Função para remover um item do carrinho
  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((item, i) => i !== index);
    setItems(updatedItems); 
  };

  // Função para atualizar a quantidade de um item
  const handleUpdateQuantity = (index, quantity) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, quantity: quantity } : item 
    );
    setItems(updatedItems); 
  };

  // Função para editar um item existente
  const handleEditItem = (index) => {
    const originalIndex = items.findIndex((item) => filteredItems[index].name === item.name);
    setIsEditing(true); 
    setCurrentItemIndex(originalIndex); 
    setNewItem(items[originalIndex].name); 
    setNewQuantity(items[originalIndex].quantity); 
  };

  // Função para finalizar a compra e exibir o comprovante 
  const handleFinalizePurchase = () => {
    if (items.length === 0) {
      setError('Nenhum item encontrado no carrinho'); 
      setReceipt(null); 
    } else {
      const totalItems = items.reduce((acc, item) => acc + item.quantity, 0); 
      const receiptDetails = items.map(
        (item) => `${item.name} - Qtd:  ${item.quantity}` // Detalhes do comprovante
      );
      setReceipt({
        items: receiptDetails, // Define os itens do comprovante
        totalItems: totalItems, // Define total de itens no comprovante
      });
      setError(null); // Limpa o erro se a compra for finalizada
    }
  };

  // Função para fechar o comprovante ou mensagem de erro
  const handleCloseModal = () => {
    setReceipt(null); 
    setError(null); 
  };

  // Filtra itens com base no termo de busca
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  // Renderização do componente
  return (
    <div className="App">
      <h1>Carrinho de Compras</h1>

      {/* Exibir mensagem de erro ao adicionar item */}
      {itemError && <div className="error-message">{itemError}</div>}

      {/* Adicionar novo item */}
      <div className="container">
        <input
          type="text"
          value={newItem} 
          onChange={(e) => setNewItem(e.target.value)} 
          placeholder="Digite o nome do item..."
        />
        <input
          type="number"
          min="1"
          value={newQuantity}
          onChange={(e) => setNewQuantity(parseInt(e.target.value) || 1)} // Garante que sempre haja um valor
          placeholder="Quantidade"
        />
        <button onClick={handleAddItem}> 
          {isEditing ? 'Salvar Edição' : 'Adicionar Item'} 
        </button>
      </div>

      {/* Consulta de item instantânea */}
      <div className="container">
        <input
          type="text"
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Digite o nome do item para consultar..."
        />
      </div>

      {/* Exibir os resultados da consulta */}
      {filteredItems.length > 0 ? (
        <ul>
          {filteredItems.map((item, index) => (
            <li key={index}>
              {item.name} - Qtd: 
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleUpdateQuantity(
                    items.findIndex((origItem) => origItem.name === item.name), 
                    parseInt(e.target.value) 
                  )
                }
              />
              <button onClick={() => handleEditItem(index)}>Editar</button>
              <button
                onClick={() =>
                  handleRemoveItem(items.findIndex((origItem) => origItem.name === item.name)) 
                }
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      ) : (
        searchTerm && <p>Item não encontrado</p> 
      )}

      {/* Exibir todos os itens se não houver consulta */}
      {filteredItems.length === 0 && !searchTerm && (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.name} - Qtd: 
              <input
                type="number"
                min="1"
                value={item.quantity} 
                onChange={(e) => handleUpdateQuantity(index, parseInt(e.target.value))} 
              />
              <button onClick={() => handleEditItem(index)}>Editar</button>
              <button onClick={() => handleRemoveItem(index)}>Remover</button>
            </li>
          ))}
        </ul>
      )}

      {/* Botão para finalizar a compra */}
      <button className="finalize-button" onClick={handleFinalizePurchase}>
        Finalizar Compra
      </button>

      {/* Modal para exibir o comprovante ou mensagem de erro */}
      {(receipt || error) && (
        <div className="modal">
          <div className="modal-content">
            {receipt ? (
              <>
                <h2>Comprovante da Compra</h2>
                <ul>
                  {receipt.items.map((item, index) => (
                    <li key={index}>{item}</li> 
                  ))}
                </ul>
                <p>Total de itens: {receipt.totalItems}</p> 
              </>
            ) : (
              <p>{error}</p> 
            )}
            <button onClick={handleCloseModal}>Fechar</button> 
          </div>
        </div>
      )}
    </div>
  );
}

export default App;