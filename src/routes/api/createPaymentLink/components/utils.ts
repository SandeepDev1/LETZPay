import {currencies} from "../models/currencies";

export const checkIfWeSupportCurrency = (currency: string) => {
    return !!currencies[currency as keyof typeof currencies];
}