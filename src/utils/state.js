import fs from 'fs';

import { createJsonFile } from './json_text_content';

export async function saveAndReadFile(contentFilePath, contentKey, contentValue) {
  // save file
  const contentKeyString = JSON.stringify(contentKey)
  const contentValueString = JSON.stringify(contentValue)

  const jsonFile = createJsonFile(contentKeyString, contentValueString)

  await fs.writeFileSync(contentFilePath, jsonFile);

  // read file
  const fileBuffer = await fs.readFileSync(contentFilePath, 'utf-8')
  const contentJson = JSON.parse(fileBuffer)

  // return
  console.log(contentJson)
  return contentJson;
}