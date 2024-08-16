// 8pm -> 8
// 12pm -> 12
export function convertTo24Hour(time12h: string): number {
  // Split the time into hours and modifier (am/pm)
  let [hours, modifier] = time12h.match(/(\d+)(am|pm)/i)?.slice(1) || []

  // Convert string to lowercase for consistent comparison
  modifier = modifier.toLowerCase()

  if (hours === '12') {
    // 12am should be 00, 12pm should stay 12
    hours = modifier === 'am' ? '00' : '12'
  } else if (modifier === 'pm') {
    // Convert PM times except 12pm
    hours = (parseInt(hours, 10) + 12).toString()
  }

  return parseInt(hours, 10)
}
