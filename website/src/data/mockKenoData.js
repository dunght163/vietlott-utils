function generateDraws() {
  const draws = [];
  const baseId = 278001;
  const today = new Date();

  for (let i = 0; i < 40; i++) {
    const numbers = [];
    const used = new Set();
    while (numbers.length < 20) {
      const n = Math.floor(Math.random() * 80) + 1;
      if (!used.has(n)) {
        used.add(n);
        numbers.push(n);
      }
    }
    numbers.sort((a, b) => a - b);

    const evenCount = numbers.filter(n => n % 2 === 0).length;
    const oddCount = 20 - evenCount;
    const bigCount = numbers.filter(n => n >= 41).length;
    const smallCount = 20 - bigCount;

    let evenOddBadge, bigSmallBadge;
    if (evenCount > oddCount) evenOddBadge = 'chan';
    else if (oddCount > evenCount) evenOddBadge = 'le';
    else evenOddBadge = 'hoacl';

    if (bigCount > smallCount) bigSmallBadge = 'lon';
    else if (smallCount > bigCount) bigSmallBadge = 'be';
    else bigSmallBadge = 'hoalb';

    const drawDate = new Date(today);
    drawDate.setMinutes(drawDate.getMinutes() - i * 10);

    const dd = String(drawDate.getDate()).padStart(2, '0');
    const mm = String(drawDate.getMonth() + 1).padStart(2, '0');
    const yyyy = drawDate.getFullYear();
    const hh = String(drawDate.getHours()).padStart(2, '0');
    const mi = String(drawDate.getMinutes()).padStart(2, '0');

    draws.push({
      id: baseId + i,
      date: `${dd}/${mm}/${yyyy}`,
      time: `${hh}:${mi}`,
      dateRaw: `${yyyy}-${mm}-${dd}`,
      numbers,
      evenCount,
      oddCount,
      bigCount,
      smallCount,
      evenOddBadge,
      bigSmallBadge,
    });
  }

  return draws;
}

export const mockKenoData = generateDraws();
