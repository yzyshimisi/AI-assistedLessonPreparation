import loginAPI from "./Server/loginAPI";
import registerAPI from "./Server/registerAPI";
import findPasswordAPI from "./Server/findPasswordAPI";
import sendVerificationCodeAPI from "./Server/sendVerificationCodeAPI";
import changePassAPI from "./Server/changePassAPI";
import getTopicListAPI from "./Server/chat/getTopicListAPI";
import deleteTopicAPI from "./Server/chat/deleteTopicAPI";
import modifyTitleAPI from "./Server/chat/modifyTitleAPI";
import createTopicAPI from "./Server/chat/createTopicAPI";
import getChatHistoryAPI from "./Server/chat/getChatHistoryAPI";
import getUserInfoAPI from "./Server/getUserInfoAPI";
import changeUserInfoAPI from "./Server/changeUserInfoAPI";
import createDirectoryAPI from "./Server/myResources/createDirectoryAPI";
import getFileListAPI from "./Server/myResources/getFileListAPI";
import getFileInfoAPI from "./Server/myResources/getFileInfoAPI";
import modifyFileNameAPI from "./Server/myResources/modifyFileNameAPI";
import deleteFileAPI from "./Server/myResources/deleteFileAPI";
import uploadFileAPI from "./Server/myResources/uploadFileAPI";
import collectFileAPI from "./Server/myResources/collectFileAPI";
import moveFileAPI from "./Server/myResources/moveFileAPI";
import searchFileAPI from "./Server/myResources/searchFileAPI";
import filterFileTypeAPI from "./Server/myResources/filterFileTypeAPI";
import userUploadAPI from "./Server/userUploadAPI";
import getRecycleListAPI from "./Server/myResources/getRecycleListAPI";
import restoreFileAPI from "./Server/myResources/restoreFileAPI";
import completelyDelAPI from "./Server/myResources/completelyDelAPI";
import getCourseListAPI from "./Server/classManagement/getCourseListAPI";
import createCourseAPI from "./Server/classManagement/createCourseAPI";
import getClassListAPI from "./Server/classManagement/getClassListAPI";
import deleteCourseAPI from "./Server/classManagement/deleteCourseAPI";
import getTimetableAPI from "./Server/classManagement/getTimetableAPI";
import oneClickInputAPI from "./Server/classManagement/classUserManagement/oneClickInputAPI";
import editCourseAPI from "./Server/classManagement/editCourseAPI";
import getCourseClassesListAPI from "./Server/classManagement/classUserManagement/getCourseClassesListAPI";
import addStudentInfoAPI from "./Server/classManagement/classUserManagement/addStudentInfoAPI";
import getStudentInfoAPI from "./Server/classManagement/classUserManagement/getStudentInfoAPI";
import editStudentInfoAPI from "./Server/classManagement/classUserManagement/editStudentInfoAPI";
import getAcademicAchieveAPI from "./Server/classAcademic/getAcademicAchieveAPI";
import delStudentInfoAPI from "./Server/classManagement/classUserManagement/delStudentInfoAPI";
import updateScoreAPI from "./Server/classAcademic/updateScoreAPI";
import addScoreAPI from "./Server/classAcademic/addScoreAPI";
import delScoreAPI from "./Server/classAcademic/delScoreAPI";
import exportScoreAPI from "./Server/classAcademic/exportScoreAPI";
import obtainClassListAPI from "./Server/classAcademic/examScoreSummary/obtainClassListAPI";
import getAverageGpaAPI from "./Server/classAcademic/examScoreSummary/getAverageGpaAPI";
import getScoreOverviewAPI from "./Server/classAcademic/examScoreSummary/getScoreOverviewAPI";
import getClassStudentListAPI from "./Server/classAcademic/examScoreAnalyse/getClassStudentListAPI";
import getStudentGpaRankAPI from "./Server/classAcademic/examScoreAnalyse/getStudentGpaRankAPI";
import getStuCourseScoreAPI from "./Server/classAcademic/examScoreAnalyse/getStuCourseScoreAPI";
import getStuChapterScoreAPI from "./Server/classAcademic/examScoreAnalyse/getStuChapterScoreAPI";
import createShareAPI from "./Server/myResources/createShareAPI";
import publishResourcesAPI from "./Server/sourceMaterial/publishResourcesAPI";
import getResourcesListAPI from "./Server/sourceMaterial/getResourcesListAPI";
import searchResourcesAPI from "./Server/sourceMaterial/searchResourcesAPI";
import searchTopicAPI from "./Server/chat/searchTopicAPI";
import sendMsgAPI from "./Server/chat/sendMsgAPI";
import lessonPlanUploadAPI from "./Server/lessonPlanDesign/lessonPlanUploadAPI";
import createLessonPlanAPI from "./Server/lessonPlanDesign/createLessonPlanAPI";
import resourceFileUploadAPI from "./Server/sourceMaterial/resourceFileUploadAPI";
import getDirStructureAPI from "./Server/myResources/getDirStructureAPI";
import getSubjectListAPI from "./Server/sourceMaterial/getSubjectListAPI";
import oneClickTransferAPI from "./Server/sourceMaterial/oneClickTransferAPI";

export {
    loginAPI,
    registerAPI,
    findPasswordAPI,
    sendVerificationCodeAPI,
    changePassAPI,
    getTopicListAPI,
    deleteTopicAPI,
    modifyTitleAPI,
    createTopicAPI,
    getChatHistoryAPI,
    getUserInfoAPI,
    changeUserInfoAPI,
    createDirectoryAPI,
    getFileListAPI,
    getFileInfoAPI,
    modifyFileNameAPI,
    deleteFileAPI,
    uploadFileAPI,
    collectFileAPI,
    moveFileAPI,
    searchFileAPI,
    filterFileTypeAPI,
    userUploadAPI,
    getRecycleListAPI,
    restoreFileAPI,
    completelyDelAPI,
    getCourseListAPI,
    createCourseAPI,
    getClassListAPI,
    deleteCourseAPI,
    getTimetableAPI,
    oneClickInputAPI,
    editCourseAPI,
    getCourseClassesListAPI,
    addStudentInfoAPI,
    getStudentInfoAPI,
    editStudentInfoAPI,
    getAcademicAchieveAPI,
    delStudentInfoAPI,
    updateScoreAPI,
    addScoreAPI,
    delScoreAPI,
    exportScoreAPI,
    obtainClassListAPI,
    getAverageGpaAPI,
    getScoreOverviewAPI,
    getClassStudentListAPI,
    getStudentGpaRankAPI,
    getStuCourseScoreAPI,
    getStuChapterScoreAPI,
    createShareAPI,
    publishResourcesAPI,
    getResourcesListAPI,
    searchResourcesAPI,
    searchTopicAPI,
    sendMsgAPI,
    lessonPlanUploadAPI,
    createLessonPlanAPI,
    resourceFileUploadAPI,
    getDirStructureAPI,
    getSubjectListAPI,
    oneClickTransferAPI,
}
