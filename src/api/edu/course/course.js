import request from '@/utils/request'
import url from 'postcss-url'

export default {
    addCourseInfo(CourseInfo) {
        return request({
            url: `/eduCourse/addCourseInfo`,
            method: 'post',
            data: CourseInfo
        })
    },
    getCourseInfoById(courseId){
        return request({
            url: `/eduCourse/getCourseInfoByCourseId/${courseId}`,
            method: 'get'
        })
    },
    updateCourseInfo(CourseInfo){
        return request({
            url: `/eduCourse/updateCourseInfo`,
            method: 'post',
            data: CourseInfo
        })
    },
    selectCourseInfoVoByCourseId(courseId){
        return request({
            url: `/eduCourse/selectCoursePublishVoByCourseId/${courseId}`,
            method: 'get'
        })
    },
    updateCourseStatus(courseId){
        return request({
            url: `/eduCourse/updateCourseStatus/${courseId}`,
            method: 'post'
        })
    }
}