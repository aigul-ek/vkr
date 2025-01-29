module.exports.compareDocuments = (oldDocument, newDocument) => {
    let previousFormulas = {}
    oldDocument.formulas.forEach((formula) => { previousFormulas[`${formula.documentLocation}:${formula.documentOrder}`] = formula.text })

    const counters = {
      same: [],
      new: [],
      change: [],
      move: [],
      remove: []
    }

    let existingFormulas = []
    newDocument.formulas.forEach((formula) => {
      const key = `${formula.documentLocation}:${formula.documentOrder}`
      const existingKey = getKeyByValue(previousFormulas, formula.text)
      if (existingKey) {
        if (existingKey !== key) {
          const keyParts = key.split(':')
          const existingKeyParts = existingKey.split(':')
          if (keyParts[0] !== existingKeyParts[0]) {
            counters.move.push({ text: formula.text, documentLocation: formula.documentLocation, documentLocationOld: existingKeyParts[0] })
          } else {
            counters.same.push({ text: formula.text, documentLocation: formula.documentLocation })
          }
        } else {
          counters.same.push({ text: formula.text, documentLocation: formula.documentLocation })
        }

        delete previousFormulas[existingKey]
      } else {
        existingFormulas.push(formula)
      }
    })

    let lastExistingFormulas = []
    existingFormulas.forEach((formula) => {
      const key = `${formula.documentLocation}:${formula.documentOrder}`
      if (previousFormulas[key]) {
        if (previousFormulas[key] !== formula.text) {
          counters.change.push({ text: formula.text, documentLocation: formula.documentLocation })
        } else {
          counters.same.push({ text: formula.text, documentLocation: formula.documentLocation })
        }

        delete previousFormulas[key]
      } else {
        lastExistingFormulas.push(formula)
      }
    })

    counters.new = lastExistingFormulas.map((formula) => { return { text: formula.text, documentLocation: formula.documentLocation }})
    counters.remove = Object.keys(previousFormulas).map((formulaKey) => { return { text: previousFormulas[formulaKey], documentLocation: formulaKey.split(':')[0] }})

    return counters
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value)
}
