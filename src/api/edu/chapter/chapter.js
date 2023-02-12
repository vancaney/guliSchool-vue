import request from '@/utils/request'
import url from 'postcss-url'

export default {
    getEduChapterList(courseId) {
        return request({
            url: `/eduChapter/eduChapterList/${courseId}`,
            method: 'get'
        })
    },
}