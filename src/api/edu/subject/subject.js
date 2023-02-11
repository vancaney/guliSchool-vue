import request from '@/utils/request'
import url from 'postcss-url'

export default {
    getAllSubject() {
        return request({
            url: `/eduSubject/allSubject`,
            method: 'get'
        })
    },
    getTwoLevelFromOneLevel(id){
        return request({
            url: `/eduSubject/getTwoLevelFromOneLevel/${id}`,
            method: 'get'
        })
    }
}