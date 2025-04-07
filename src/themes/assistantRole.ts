

const assistantRoleBaseURL = '/assistantRole/'

const getNum = (name) => {
    console.log(name)
    console.log(name)
    switch (name){
        case 'C11':
            return 21;

        case 'C19':
            return 20;
    }
}

const getAssistantRoleSrc = (nowAssistantRole) => {
    let num = getRandomNum(1,getNum(nowAssistantRole))
    // console.log(`${assistantRoleBaseURL}${nowAssistantRole}/${nowAssistantRole}_${num}.png`)
    return `${assistantRoleBaseURL}${nowAssistantRole}/${nowAssistantRole}_${num}.png`
}

const getRandomNum = (min,max) => {
    min = Math.ceil(min); // 确保是整数
    max = Math.floor(max); // 确保是整数
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default getAssistantRoleSrc;