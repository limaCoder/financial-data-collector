export function createJsonFile(key, value) {
  let jsonTextContent = '{\n';
    jsonTextContent += `\t${key}: ${value}\n`
  jsonTextContent += '}'

  return jsonTextContent
}
