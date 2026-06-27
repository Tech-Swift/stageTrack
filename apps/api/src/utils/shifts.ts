const toMinutes = (time: string) => {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
};

export const shiftsOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
) => {
  const s1 = toMinutes(start1);
  const e1 = toMinutes(end1);

  const s2 = toMinutes(start2);
  const e2 = toMinutes(end2);

  // normal shifts
  if (
    e1 > s1 &&
    e2 > s2
  ) {
    return s1 < e2 && s2 < e1;
  }

  // overnight shifts
  const normalize = (
    start: number,
    end: number
  ) => {
    if (end <= start) {
      end += 24 * 60;
    }

    return { start, end };
  };

  const a = normalize(s1, e1);
  const b = normalize(s2, e2);

  return (
    a.start < b.end &&
    b.start < a.end
  );
};