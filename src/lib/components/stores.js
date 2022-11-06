import { writable } from "svelte/store";

export const activeElement = writable(0)

export const isCryptoDropDownActive = writable(false)
export let tempIsCryptoDropDownActive = false

isCryptoDropDownActive.subscribe(value => {
  console.log(value)
  tempIsCryptoDropDownActive = value
})

export const isCurrencyDropDownActive = writable(false)
export let tempIsCurrencyDropDownActive = false

isCurrencyDropDownActive.subscribe(value => {
  console.log(value)
  tempIsCurrencyDropDownActive = value
})

export const activeCryptoCurrency = writable({})
export const activeCryptoIndex = writable(0)

export const isAdvancedDropDownActive = writable(false)
export let tempIsAdvancedDropDownActive = false

isAdvancedDropDownActive.subscribe(value => {
  console.log(value)
  tempIsAdvancedDropDownActive = value
})

export const activeCurrency = writable({})
export const activeCurrencyIndex = writable(0)


