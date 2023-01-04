const whitespace = /\S+/;
const validString = /^[a-z]+$/i;
const validNumber = /^\d+$/;
const validUrl = /^(ftp|http|https):\/\/[^ "]+$/;

export default function validate(input) {
  let errors = {};

  // Name validation
  if (
    !whitespace.test(input.name) ||                // Si contiene espacio en blanco
    !validString.test(input.name) ||               // Si contiene characteres que no sean letras
    input.name.length < 3                          // Si contiene menos de 3 characteres
  ) errors.name = "Name is required. Must be longer than two characters and cannot contain numbers or special characters.";

  // Hp validation 
  if (
    !validNumber.test(input.hp) ||       // Si no es un número (0-9)
    parseInt(input.hp) < 1      ||       // Si es un número menor a 1
    parseInt(input.hp) > 200             // Si es un número mayor a 200
  ) errors.hp = "Hp is required. Must be higher than 1 and less than 200.";

  // Attack validation 
  if (
    !validNumber.test(input.attack) || 
    parseInt(input.attack) < 1 ||
    parseInt(input.attack) > 200
  ) errors.attack = "Attack is required. Must be higher than 1 and less than 200.";
  
  // Defense validation 
  if (
    !validNumber.test(input.defense) || 
    parseInt(input.defense) < 1 ||
    parseInt(input.defense) > 200
  ) errors.defense = "Defense is required. Must be higher than 1 and less than 200.";
  
  // Speed validation 
  if (
    !validNumber.test(input.speed) || 
    parseInt(input.speed) < 1 ||
    parseInt(input.speed) > 200
  ) errors.speed = "Speed is required. Must be higher than 1 and less than 200.";

  // Height validation 
  if (
    !validNumber.test(input.height) || 
    parseInt(input.height) < 1 ||
    parseInt(input.height) > 200
  ) errors.height = "Height is required. Must be higher than 1 and less than 200.";

  // Weight validation 
  if (
    !validNumber.test(input.weight) || 
    parseInt(input.weight) < 1 ||
    parseInt(input.weight) > 1000
  ) errors.weight = "Weight is required. Must be higher than 1 and less than 1000.";
  
  // Image validation 
  if (
    !validUrl.test(input.image)                   // Si no es una URL válida
  ) errors.image = "Image is required. Must be a valid URL.";

  // Types validation 
  if (
    input.types.length === 0 ||                   // Si no hay ningún type seleccionado
    input.types.length > 2                        // Si hay más de 2 tipos seleccionados
  ) errors.types = "Type is required. You can select up to 2 types.";

  return errors;
}