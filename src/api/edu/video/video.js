import request from '@/utils/request'
import url from 'postcss-url'

export default {
    addEduVideo(eduVideo){
        return request({
            url: `/eduvideo/addeduvideo`,
            method: 'post',
            data: eduVideo
        })
    },
    updateEduVideo(eduVideo){
        return request({
            url: `/eduvideo/updateeduvideo`,
            method: 'post',
            data: eduVideo
        })
    },
    selectVideoById(VideoId){
        return request({
            url: `/eduvideo/selectEduVideoById/${VideoId}`,
            method: 'get'
        })
    },
    deleteVideoById(VideoId){
        return request({
            url: `/eduvideo/deleteVideoById/${VideoId}`,
            method: 'post'
        })
    }
}