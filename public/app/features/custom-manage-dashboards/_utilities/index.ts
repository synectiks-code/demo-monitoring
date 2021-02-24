const TAG_COLORS = [
  '#D32D20',
  '#1E72B8',
  '#B240A2',
  '#705DA0',
  '#466803',
  '#497A3C',
  '#3D71AA',
  '#B15415',
  '#890F02',
  '#6E6E6E',
  '#0A437C',
  '#6D1F62',
  '#584477',
  '#4C7A3F',
  '#2F4F4F',
  '#BF1B00',
  '#7662B1',
  '#8A2EB8',
  '#517A00',
  '#000000',
  '#3F6833',
  '#2F575E',
  '#99440A',
  '#AE561A',
  '#0E4AB4',
  '#58140C',
  '#052B51',
  '#511749',
  '#3F2B5B',
];

function djb2(str: any) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i); /* hash * 33 + c */
  }
  return hash;
}

export function getTagColorsFromName(name = ''): { backgroundColor: string; borderColor: string } {
  const hash = djb2(name.toLowerCase());
  const index = Math.abs(hash % TAG_COLORS.length);
  return getTagColor(index);
}

function getTagColor(index: number): { backgroundColor: string; borderColor: string } {
  return { backgroundColor: TAG_COLORS[index], borderColor: TAG_COLORS[index] };
}
