import interactionsType from "../contexts/interactionsType";


export const getCodeByInteractionType = (interactionType) => {
      
    const interaction = Object.values(interactionsType).find(
      (int) => int.MESSAGE === interactionType
    );
  
    if (interaction) {
      return interaction.CODE;
    } else {
      console.error("Tipo de interação inválido:", interactionType);
      return null; // Retorna null se o tipo de interação não for encontrado
    }
  };