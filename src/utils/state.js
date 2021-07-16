import fs from 'fs';

export function saveAndReadFile(contentFilePath, contentKey, data) {

  const result = {resultado: data}

  fs.writeFile(contentFilePath, JSON.stringify(result, 'utf-8'), () => {});

  console.log(result)

  return result;
}