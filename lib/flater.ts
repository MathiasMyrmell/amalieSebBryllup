/** Kortflate som kontrasterer mot seksjonens bakgrunn */
export function kortFlate(toner?: boolean) {
  return toner ? "bg-krem" : "bg-krem-dyp";
}

/** Innfelt flate (kart, felt, plassholder) inni et kort */
export function innfeltFlate(toner?: boolean) {
  return toner ? "bg-krem-dyp" : "bg-krem";
}
