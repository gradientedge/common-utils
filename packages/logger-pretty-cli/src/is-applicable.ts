export function isApplicable(jsonObject: any) {
  return jsonObject.hasOwnProperty('level') && jsonObject.hasOwnProperty('data')
}
