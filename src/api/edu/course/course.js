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
}