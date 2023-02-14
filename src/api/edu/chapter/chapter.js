import request from '@/utils/request'
import url from 'postcss-url'

export default {
    getEduChapterList(courseId) {
        return request({
            url: `/eduChapter/eduChapterList/${courseId}`,
            method: 'get'
        })
    },
    addChapter(chapter) {
        return request({
            url: `/eduChapter/addChapter`,
            method: 'post',
            data: chapter
        })
    },
    deleteChapterById(chapterId){
        return request({
            url: `/eduChapter/deleteChapterById/${chapterId}`,
            method: 'post',
            data: chapterId
        })
    },
    updateChapterById(chapter){
        return request({
            url: `/eduChapter/updateChapterById`,
            method: 'post',
            data: chapter
        })
    },
    selectChapterById(chapterId){
        return request({
            url: `/eduChapter/selectChapterById/${chapterId}`,
            method: 'get'
        })
    }
}