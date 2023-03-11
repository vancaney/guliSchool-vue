import request from '@/utils/request'
import url from 'postcss-url'

export default{
    createDigital(day){
        return request({
            url: `edu/statistics-daily/countRegistryForDay/${day}`,
            method: 'post'
        })
    },

    showData(searchObj){
        return request({
            url: `edu/statistics-daily/showData`,
            method: 'post',
            data: searchObj
        })
    }
}
