const parisStreets = [
  'Rue de Rivoli', 'Avenue des Champs-Élysées', 'Boulevard Saint-Germain',
  'Rue du Faubourg Saint-Honoré', 'Avenue Montaigne', 'Rue de la Paix',
  'Boulevard Haussmann', 'Rue de Vaugirard', 'Avenue de l\'Opéra', 'Rue Mouffetard'
];

const parisArrondissements = [
  '75001', '75002', '75003', '75004', '75005', '75006', '75007', '75008', '75009', '75010',
  '75011', '75012', '75013', '75014', '75015', '75016', '75017', '75018', '75019', '75020'
];

export function getAddressFromCoordinates(lat: number, lon: number): string {
  const streetNumber = Math.floor(Math.random() * 200) + 1;
  const streetName = parisStreets[Math.floor(Math.random() * parisStreets.length)];
  const zipCode = parisArrondissements[Math.floor(Math.random() * parisArrondissements.length)];

  return `${streetNumber} ${streetName}, ${zipCode} Paris, France`;
}