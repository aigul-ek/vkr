const { sendMail } = require('./mailer')

module.exports.notifyResults = async (results, headline, documentName, notifyBy = 'email') => {
  let texts = [
    `В документе "${documentName}":`
  ]

  let newBlocks = []
  results.new.forEach(formula => {
    const blockId = formula.documentLocation.split('_')[1]
    const blockTextStrip = searchInHeadline(headline, blockId).replace('Пункт ', '')
    if (!newBlocks.includes(blockTextStrip)) {
        newBlocks.push(blockTextStrip)
    }
  })

  if (newBlocks.length > 0) {
    texts.push(`в п.п. ${newBlocks.join(', ')} найдены новые формулы`)
  }

  let changedBlocks = []
  results.change.forEach(formula => {
    const blockId = formula.documentLocation.split('_')[1]
    const blockTextStrip = searchInHeadline(headline, blockId).replace('Пункт ', '')
    if (!changedBlocks.includes(blockTextStrip)) {
      changedBlocks.push(blockTextStrip)
    }
  })

  if (changedBlocks.length > 0) {
    texts.push(`в п.п. ${changedBlocks.join(', ')} изменились формулы`)
  }

  let movedBlocks = []
  let movedOldBlocks = []
  results.move.forEach(formula => {
    const blockId = formula.documentLocation.split('_')[1]
    const blockTextStrip = searchInHeadline(headline, blockId).replace('Пункт ', '')
    if (!movedBlocks.includes(blockTextStrip)) {
      movedBlocks.push(blockTextStrip)
    }
    const blockOdlId = formula.documentLocationOld.split('_')[1]
    const blockOldTextStrip = searchInHeadline(headline, blockOdlId).replace('Пункт ', '')
    if (!movedOldBlocks.includes(blockOldTextStrip)) {
      movedOldBlocks.push(blockOldTextStrip)
    }
  })

  if (movedBlocks.length > 0) {
    texts.push(`в п.п. ${movedBlocks.join(', ')} перемещены формулы из п.п. ${movedOldBlocks.join(', ')} старой редакции`)
  }

  let removedBlocks = []
  results.remove.forEach(formula => {
    const blockId = formula.documentLocation.split('_')[1]
    const blockTextStrip = searchInHeadline(headline, blockId).replace('Пункт ', '')
    if (!removedBlocks.includes(blockTextStrip)) {
      removedBlocks.push(blockTextStrip)
    }
  })

  if (removedBlocks.length > 0) {
    texts.push(`из п.п. ${removedBlocks.join(', ')} старой редакции удалены формулы`)
  }

  if (texts.length > 1) {
    switch (notifyBy) {
      case 'email':
        await sendMail(documentName, texts.join('\n'))
        break
      case 'console':
        texts.forEach(text => console.log(text))
        break
      default:
        break
    }
  } else {
    console.log('Изменений не найдено')
  }
}

const searchInHeadline = (obj, id) => {
  const result = searchElementById(obj, id);
  if (result) {
    return result
  }

  const originalId = id
  while (id.length > 2) {
      id = id.slice(0, -1)
      const result = searchElementById(obj, id);
      if (result) {
          return result
      }
  }

  return 'Неизвестный раздел'
}

const searchElementById = (obj, id) => {
  if (obj.data?.element?.id == id && obj.text) {
      return obj.text
  }

  if (obj.children) {
      for (const child of obj.children) {
          const result = searchElementById(child, id);
          if (result) {
              return result;
          }
      }
  }

  return null
}
