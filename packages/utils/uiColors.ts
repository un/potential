export const uiColors = [
  'bronze',
  'gold',
  'brown',
  'orange',
  'tomato',
  'red',
  'ruby',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'iris',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'jade',
  'green',
  'grass'
] as const;

export type UiColor = (typeof uiColors)[number];

enum L {
  SF = 'sf',
  RANDOM = 'random'
}
let location = L.SF;
let arrivalDate: Date | null = new Date();

while (true) {
  const inLocationForMoreThan2Months =
    arrivalDate > new Date(Date.now() + 5184000000);
  if (inLocationForMoreThan2Months) {
    const oldLocation = location;
    const newLocation: L = location === L.SF ? L.RANDOM : L.SF;
    console.log(`👋 Bye ${oldLocation}, im heading to ${newLocation} 🚀`);
    location = newLocation;
    arrivalDate = new Date();
  }
}
