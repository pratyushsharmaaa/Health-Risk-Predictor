export function calcAge(dob) {
  const birth = new Date(dob)
  return Math.floor((Date.now() - birth.getTime()) / 31557600000)
}
export function calcBmi(height, heightUnit, weight, weightUnit) {
  let h = parseFloat(height)
  let w = parseFloat(weight)
  if (heightUnit === 'in') h *= 2.54
  if (weightUnit === 'lb') w *= 0.453592
  h = h / 100 // to meters
  return h > 0 ? +(w / (h * h)).toFixed(1) : null
}
