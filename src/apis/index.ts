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
}
