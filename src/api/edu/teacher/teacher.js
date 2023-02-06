import request from '@/utils/request'
import url from 'postcss-url'

export default {
  //分页查询
  getTeacherListByPage(teacherQueryResult){
    return request({
      url: `/eduTeacher/ConditionalQuery`,
      method: 'post',
      data: teacherQueryResult
    })
  },
  selectTeacherById(id){
    return request({
      url: `/eduTeacher/selectById/${id}`,
      method: 'get'
    })
  },
  //添加讲师
  addeduTeacher(eduTeacher){
    return request({
      url: `/eduTeacher/add`,
      method: 'post',
      data: eduTeacher
    })
  },
  //删除讲师
  deleteById(id){
    return request({
      url: `/eduTeacher/deleteById/${id}`,
      method: 'post',
      data: id
    })
  },
  editeduTeacher(eduTeacher){
    return request({
      url: `/eduTeacher/editTeacher`,
      method: 'post',
      data: eduTeacher
    })
  },
  upLoadImage(file){
    return request({
      url: `/eduoss/file`,
      method: 'post',
      data: file
    })
  },
  deleteMuch(eduTeacherIds){
    return request({
      url: `/eduTeacher/deleteByIds`,
      method: 'post',
      data: eduTeacherIds
    })
  }
}