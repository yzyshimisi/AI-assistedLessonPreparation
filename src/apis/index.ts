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
}
