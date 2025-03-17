import { EProductService } from "../enums/services/EProductService"
import { EService } from "../enums/services/EService"
import { instance } from "../lib/axios"

export const productService = {
    findAll: () => {
        const url = `${EService.PRODUCT_SERVICE}/${EProductService.FIND_ALL}`
        return instance.get(url)
    },

    findOneById: (id: number) => {
        const url = `${EService.PRODUCT_SERVICE}/${id}`
        return instance.get(url)
    }
}