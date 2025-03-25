

const assistantRoleBaseURL = '/assistantRole/'
const nowAssistantRole = 'C11'

const C11_num = 21

const getAssistantRoleSrc = () => {
    let num = getRandomNum(1,C11_num)
    // console.log(`${assistantRoleBaseURL}${nowAssistantRole}/${nowAssistantRole}_${num}.png`)
    return `${assistantRoleBaseURL}${nowAssistantRole}/${nowAssistantRole}_${num}.png`
}

const getRandomNum = (min,max) => {
    min = Math.ceil(min); // 确保是整数
    max = Math.floor(max); // 确保是整数
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default getAssistantRoleSrc;